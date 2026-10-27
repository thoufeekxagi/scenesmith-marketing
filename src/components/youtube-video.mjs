"use client";

import React, {useState} from "react";

const idPattern = /^[A-Za-z0-9_-]{11}$/;

export function youtubeEmbedUrl(videoId, start) {
  if (!idPattern.test(videoId)) throw new Error("Invalid YouTube video ID");
  const url = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  if (Number.isSafeInteger(start) && start > 0) url.searchParams.set("start", String(start));
  return url.toString();
}

export function YoutubeVideo({videoId, videoTitle, title, start}) {
  const [loaded, setLoaded] = useState(false);
  const accessibleTitle = videoTitle ?? title;
  if (!idPattern.test(videoId ?? "") || !accessibleTitle?.trim()) return null;
  const startSeconds = typeof start === "string" && /^\d+$/.test(start) ? Number(start) : start;

  const watchUrl = new URL("https://www.youtube.com/watch");
  watchUrl.searchParams.set("v", videoId);
  if (Number.isSafeInteger(startSeconds) && startSeconds > 0) watchUrl.searchParams.set("t", `${startSeconds}s`);

  return React.createElement("figure", {className: "blog-video"},
    React.createElement("div", {className: "blog-video-frame"},
      loaded
        ? React.createElement("iframe", {
          src: youtubeEmbedUrl(videoId, startSeconds),
          title: accessibleTitle,
          loading: "lazy",
          allow: "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowFullScreen: true,
          referrerPolicy: "strict-origin-when-cross-origin"
        })
        : React.createElement("button", {
          type: "button",
          className: "blog-video-load",
          onClick: () => setLoaded(true),
          "aria-label": `Load video: ${accessibleTitle}`
        },
        React.createElement("img", {
          src: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          alt: `Video thumbnail: ${accessibleTitle}`,
          loading: "lazy",
          width: 480,
          height: 360
        }),
        React.createElement("span", {className: "blog-video-play", "aria-hidden": "true"}, "▶"))
    ),
    React.createElement("figcaption", null,
      React.createElement("a", {href: watchUrl.toString(), target: "_blank", rel: "noopener noreferrer"}, "Watch on YouTube"))
  );
}
