import type {Metadata} from "next";
import {pageMetadata} from "../../lib/seo";
import {SiteFooter} from "../../components/site-footer";
import {SiteNav} from "../../components/site-nav";

export const metadata: Metadata = pageMetadata("/security", "Security | SceneSmith", "How SceneSmith protects provider credentials, enforces explicit approval before publishing, and isolates workspaces.");

const APP_ORIGIN = "https://app.scenesmith.design";

export default function SecurityPage() {
  return <main><SiteNav /><section className="chapter" style={{borderTop: 0, paddingTop: 120}}><div className="eyebrow">Security</div><h1>Exact destination. Visible state.</h1><p className="chapter-intro">SceneSmith uses official account authorization, encrypted provider credentials, explicit publish confirmation, and durable delivery records.</p><div className="trust-grid"><div className="trust-item"><strong>Account isolation</strong>Each workspace and social account is authorization-checked.</div><div className="trust-item"><strong>Provider credentials</strong>Tokens stay server-side and are never returned to ChatGPT.</div><div className="trust-item"><strong>Public actions</strong>Every schedule and publish preview names the exact handle.</div><div className="trust-item"><strong>Fault visibility</strong>Failures identify the effect, repair, and correlation ID.</div></div><div className="hero-actions"><a className="button button-primary" href={`${APP_ORIGIN}/register`}>Start 7-day trial</a></div></section><SiteFooter /></main>;
}
