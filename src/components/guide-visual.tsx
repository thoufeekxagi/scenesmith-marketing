import type {Guide} from "../lib/blog";
import Link from "next/link";

export function GuideVisual({guide}: {guide: Guide}) {
  const channel = guide.slug === "chatgpt-linkedin-posts" ? "LinkedIn" : guide.slug === "chatgpt-instagram-posts" ? "Instagram" : "Three channels";
  return <figure className={`guide-visual guide-visual-${guide.slug}`}>
    <figcaption><span>WORKED EXAMPLE</span><strong>{guide.exampleLabel}</strong><small>An example to explain the process, not a screenshot of a customer account.</small></figcaption>
    <div className="guide-visual-flow">
      <div className="guide-visual-panel guide-visual-input"><span className="guide-visual-tag">01 / SOURCE NOTE</span><p>{guide.exampleInput}</p></div>
      <span className="guide-visual-arrow" aria-hidden="true">→</span>
      <div className="guide-visual-panel guide-visual-output"><span className="guide-visual-tag">02 / SCENESMITH DRAFT</span><p>{guide.exampleOutput}</p><span className="guide-visual-destination">{channel} · Waiting for your review</span></div>
    </div>
    <div className="guide-connect-strip"><span className="guide-connect-dot" aria-hidden="true"/><div><strong>Connect ChatGPT to SceneSmith</strong><code>https://app.scenesmith.design/api/mcp</code></div><Link href="/connections">Connection steps ↗</Link></div>
  </figure>;
}
