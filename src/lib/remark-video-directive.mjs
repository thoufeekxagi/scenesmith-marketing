function directiveProperties(node) {
  const id = Array.isArray(node.children) ? node.children.map((child) => child.value ?? "").join("") : "";
  const attributes = node.attributes ?? {};
  const hProperties = {videoId: id};
  if (attributes.title !== undefined) hProperties.videoTitle = attributes.title;
  if (attributes.start !== undefined) hProperties.start = attributes.start;
  if (attributes.uploaded !== undefined) hProperties.uploaded = attributes.uploaded;
  if (attributes.duration !== undefined) hProperties.duration = attributes.duration;
  if (attributes.description !== undefined) hProperties.description = attributes.description;
  return {hName: "youtube-video", hProperties};
}

function transform(node) {
  if (!node || typeof node !== "object") return;
  if (node.type === "paragraph" && node.children?.length === 1 && node.children[0].type === "textDirective" && node.children[0].name === "video") {
    node.data = directiveProperties(node.children[0]);
    node.children = [];
    return;
  }
  if (["textDirective", "leafDirective"].includes(node.type) && node.name === "video") {
    node.data = directiveProperties(node);
    node.children = [];
    return;
  }
  if (Array.isArray(node.children)) for (const child of node.children) transform(child);
}

/** Map the restricted text directive into a React component; Markdown never becomes HTML. */
export function remarkVideoDirective() {
  return (tree) => transform(tree);
}
