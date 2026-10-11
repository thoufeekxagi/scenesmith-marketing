import type {ReactNode} from "react";
import {SiteFooter} from "./site-footer";
import {SiteNav} from "./site-nav";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  updated?: string;
  children: ReactNode;
};

export function LegalPage({eyebrow, title, intro, updated, children}: LegalPageProps) {
  return <main>
    <SiteNav />
    <article className="legal-page">
      <header className="legal-header">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p className="legal-intro">{intro}</p>
        {updated && <p className="legal-updated">{updated}</p>}
      </header>
      <div className="legal-content">{children}</div>
    </article>
    <SiteFooter />
  </main>;
}

export function LegalSection({title, children}: {title: string; children: ReactNode}) {
  return <section className="legal-section">
    <h2>{title}</h2>
    {children}
  </section>;
}

export function LegalCallout({children}: {children: ReactNode}) {
  return <aside className="legal-callout">{children}</aside>;
}
