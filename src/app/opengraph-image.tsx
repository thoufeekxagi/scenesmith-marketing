import {ImageResponse} from "next/og";

export const alt = "SceneSmith: publish from ChatGPT to Instagram, X and LinkedIn";
export const size = {width: 1200, height: 630};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#183c2b", color: "#ffffff", padding: "72px", fontFamily: "sans-serif"}}>
      <div style={{display: "flex", alignItems: "center", gap: 20}}>
        <svg width="56" height="56" viewBox="0 0 48 48"><path d="M24 1 47 24 24 47 1 24Z" fill="#ffffff"/><path d="m20 15 13 9-13 9Z" fill="#183c2b"/></svg>
        <div style={{fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em"}}>SceneSmith</div>
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: 24}}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em"}}>Your publishing layer for ChatGPT.</div>
        <div style={{fontSize: 34, color: "#cfe3d5", lineHeight: 1.35}}>Create, approve, and schedule posts to Instagram, X, and LinkedIn.</div>
      </div>
      <div style={{display: "flex", alignItems: "center", gap: 18, fontSize: 28, color: "#9fd3b0"}}>
        <div>scenesmith.design</div><div style={{opacity: 0.5}}>·</div><div>Works with ChatGPT, Codex, Cursor and MCP</div>
      </div>
    </div>,
    size
  );
}
