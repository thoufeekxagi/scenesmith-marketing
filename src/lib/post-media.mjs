const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const ATTRIBUTE = /^([a-z]+)="([^"\r\n]*)"(?:\s+|$)/;
const ALLOWED_ATTRIBUTES = new Set(["title", "start", "uploaded", "duration", "description"]);
const DURATION = /^P(?=\d|T\d)(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?=\d)(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$/;
const VIDEO_HOSTS = [
  "youtube.com", "youtube-nocookie.com", "youtu.be", "vimeo.com", "dailymotion.com",
  "wistia.com", "wistia.net", "loom.com", "twitch.tv", "streamable.com", "vidyard.com",
  "brightcove.com", "bilibili.com"
];

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

/** Parse one complete ::video directive line, throwing when any part is outside the contract. */
export function parseVideoDirective(line) {
  const match = /^::video\[([^\]\r\n]*)\]\{([^{}\r\n]*)\}$/.exec(line);
  if (!match) throw new Error("video must use one complete ::video[ID]{...} line");
  const id = match[1];
  if (!VIDEO_ID.test(id)) throw new Error("YouTube video ID must be exactly 11 letters, numbers, underscores, or hyphens");

  const attributes = Object.create(null);
  let remaining = match[2].trim();
  while (remaining) {
    const attribute = ATTRIBUTE.exec(remaining);
    if (!attribute) throw new Error("video attributes must use name=\"value\" syntax separated by spaces");
    const [, name, value] = attribute;
    if (!ALLOWED_ATTRIBUTES.has(name)) throw new Error(`unsupported video attribute: ${name}`);
    if (Object.hasOwn(attributes, name)) throw new Error(`duplicate video attribute: ${name}`);
    attributes[name] = value;
    remaining = remaining.slice(attribute[0].length).trimStart();
  }

  if (typeof attributes.title !== "string" || !attributes.title.trim()) throw new Error("video title is required for accessibility");
  if (attributes.title.length > 120) throw new Error("video title must be 120 characters or fewer");
  if (attributes.start !== undefined && (!/^\d+$/.test(attributes.start) || !Number.isSafeInteger(Number(attributes.start)))) {
    throw new Error("video start must be a whole number of seconds");
  }
  if (attributes.uploaded !== undefined && !validDate(attributes.uploaded)) throw new Error("video uploaded must be a real YYYY-MM-DD date");
  if (attributes.duration !== undefined && !DURATION.test(attributes.duration)) throw new Error("video duration must be an ISO 8601 duration such as PT4M30S");
  if (attributes.description !== undefined && (!attributes.description.trim() || attributes.description.length > 500)) {
    throw new Error("video description must be nonempty and 500 characters or fewer");
  }

  return {
    id,
    title: attributes.title,
    ...(attributes.start !== undefined ? {start: Number(attributes.start)} : {}),
    ...(attributes.uploaded !== undefined ? {uploaded: attributes.uploaded} : {}),
    ...(attributes.duration !== undefined ? {duration: attributes.duration} : {}),
    ...(attributes.description !== undefined ? {description: attributes.description} : {})
  };
}

/** Validate video directives and Mermaid code while keeping article text data-only. */
export function inspectPostMedia(markdown) {
  const issues = [];
  const videos = [];
  if (/<!--|<\/?[A-Za-z][^>]*>/.test(markdown)) issues.push("raw HTML is not allowed; use Markdown");
  const lines = markdown.split(/\r?\n/);
  const outsideCode = [];
  let fenceCharacter = "";
  let fenceLength = 0;
  for (const line of lines) {
    const marker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1] ?? "";
    if (!fenceCharacter && marker) {
      fenceCharacter = marker[0];
      fenceLength = marker.length;
      outsideCode.push(false);
    } else if (fenceCharacter) {
      outsideCode.push(false);
      if (marker && marker[0] === fenceCharacter && marker.length >= fenceLength) {
        fenceCharacter = "";
        fenceLength = 0;
      }
    } else outsideCode.push(true);
  }

  lines.forEach((line, index) => {
    if (!outsideCode[index] || !/^\s*::video\b/.test(line)) return;
    const lineNumber = index + 1;
    if (line !== line.trim()) issues.push(`line ${lineNumber}: video directive must be alone on its line`);
    try {
      videos.push(parseVideoDirective(line.trim()));
    } catch (error) {
      issues.push(`line ${lineNumber}: ${error instanceof Error ? error.message : "invalid video directive"}`);
    }
  });
  if (videos.length > 3) issues.push("a post may contain no more than three videos");

  const articleText = lines.filter((_, index) => outsideCode[index]).join("\n");
  for (const rawUrl of articleText.match(/https?:\/\/[^\s)<>"']+/g) ?? []) {
    const candidate = rawUrl.replace(/[.,!?;:]+$/, "");
    try {
      const parsedUrl = new URL(candidate);
      const hostname = parsedUrl.hostname.toLowerCase();
      const videoHost = VIDEO_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
      const youtubeHost = ["youtube.com", "youtube-nocookie.com", "youtu.be"].some((host) => hostname === host || hostname.endsWith(`.${host}`));
      if (videoHost && !youtubeHost) issues.push(`video host ${hostname} is not allowed; use the YouTube directive`);
      if (/\.(?:mp4|m4v|mov|webm|m3u8|mpd)(?:$|\?)/i.test(parsedUrl.pathname + parsedUrl.search) && !youtubeHost) {
        issues.push(`video file host ${hostname} is not allowed; use the YouTube directive`);
      }
    } catch {
      // Other malformed links are covered by the existing Markdown/content checks.
    }
  }

  const mermaidBlocks = [...markdown.matchAll(/^```mermaid[ \t]*\r?\n([\s\S]*?)^```[ \t]*$/gm)];
  for (const [index, match] of mermaidBlocks.entries()) {
    const chart = match[1];
    const blockLine = markdown.slice(0, match.index).split(/\r?\n/).length;
    if (!chart.trim()) issues.push(`Mermaid diagram ${index + 1} is empty`);
    if (chart.length > 12_000) issues.push(`Mermaid diagram ${index + 1} must be 12 KB or smaller`);
    if (/%%\s*\{|^\s*click\s+\S+|<\s*\/?\s*[a-z!][^>]*>|(?:javascript|data):/im.test(chart)) {
      issues.push(`Mermaid diagram ${index + 1} contains an unsafe directive, link, or HTML tag (near line ${blockLine})`);
    }
  }

  return {issues, videos};
}

/** @returns {Array<{id: string, title: string, start?: number, uploaded?: string, duration?: string, description?: string}>} */
export function parsePostVideos(markdown) {
  const {issues, videos} = inspectPostMedia(markdown);
  const videoIssues = issues.filter((issue) => issue.includes("video") || issue.includes("YouTube"));
  if (videoIssues.length) throw new Error(videoIssues.join("; "));
  return videos;
}

export function videoTextReference(video) {
  return `Video: https://www.youtube.com/watch?v=${video.id} (${video.title})`;
}
