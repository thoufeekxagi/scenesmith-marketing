"use client";

import {useEffect, useId, useState} from "react";

type Props = {source: string};

export function MermaidDiagram({source}: Props) {
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function renderDiagram() {
      try {
        const [{default: mermaid}, {default: DOMPurify}] = await Promise.all([
          import("mermaid"),
          import("dompurify")
        ]);
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          htmlLabels: false,
          secure: ["securityLevel", "startOnLoad", "htmlLabels"],
          theme: "neutral"
        });
        const rendered = await mermaid.render(`scenesmith-diagram-${reactId}`, source);
        const cleanSvg = DOMPurify.sanitize(rendered.svg, {USE_PROFILES: {svg: true, svgFilters: true}});
        if (!cancelled) setSvg(cleanSvg);
      } catch {
        if (!cancelled) setFailed(true);
      }
    }
    void renderDiagram();
    return () => {cancelled = true;};
  }, [reactId, source]);

  return <figure className="blog-mermaid" aria-label="Mermaid diagram">
    {svg && !failed
      ? <div className="blog-mermaid-rendered" dangerouslySetInnerHTML={{__html: svg}} />
      : <pre className={failed ? "blog-mermaid-source blog-mermaid-error" : "blog-mermaid-source"}><code>{source}</code></pre>}
  </figure>;
}
