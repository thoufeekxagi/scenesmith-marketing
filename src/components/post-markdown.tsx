import ReactMarkdown, {type Components} from "react-markdown";
import {isValidElement, type ComponentProps, type ReactNode} from "react";
import remarkDirective from "remark-directive";
import {MermaidDiagram} from "./mermaid-diagram";
import {YoutubeVideo} from "./youtube-video.mjs";
import {remarkVideoDirective} from "../lib/remark-video-directive.mjs";

type Props = {markdown: string};

const components = {
  "youtube-video": YoutubeVideo,
  pre({children, ...props}: ComponentProps<"pre">) {
    if (isValidElement<{className?: string; children?: ReactNode}>(children) && children.props.className === "language-mermaid") {
      return <MermaidDiagram source={String(children.props.children).replace(/\n$/, "")} />;
    }
    return <pre {...props}>{children}</pre>;
  },
  code({className, children, ...props}: ComponentProps<"code">) {
    return <code className={className} {...props}>{children}</code>;
  }
} as unknown as Components;

export function PostMarkdown({markdown}: Props) {
  return <ReactMarkdown skipHtml remarkPlugins={[remarkDirective, remarkVideoDirective]} components={components}>{markdown}</ReactMarkdown>;
}
