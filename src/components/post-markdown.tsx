import ReactMarkdown, {type Components} from "react-markdown";
import type {ComponentProps} from "react";
import remarkDirective from "remark-directive";
import {MermaidDiagram} from "./mermaid-diagram";
import {YoutubeVideo} from "./youtube-video.mjs";
import {remarkVideoDirective} from "../lib/remark-video-directive.mjs";

type Props = {markdown: string};

const components = {
  "youtube-video": YoutubeVideo,
  code({className, children, ...props}: ComponentProps<"code">) {
    if (className === "language-mermaid") {
      return <MermaidDiagram source={String(children).replace(/\n$/, "")} />;
    }
    return <code className={className} {...props}>{children}</code>;
  }
} as unknown as Components;

export function PostMarkdown({markdown}: Props) {
  return <ReactMarkdown skipHtml remarkPlugins={[remarkDirective, remarkVideoDirective]} components={components}>{markdown}</ReactMarkdown>;
}
