import Link from "next/link";
import {SceneSmithBrand} from "./brand";

const APP_ORIGIN = "https://app.scenesmith.design";

export function SiteNav() {
  return (
    <header className="site-nav">
      <div className="nav-inner">
        <Link className="nav-brand" href="/" aria-label="SceneSmith home"><SceneSmithBrand className="brand-lockup" /></Link>
        <nav className="nav-links" aria-label="Primary">
          <Link href="/#product">Product</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/connections">Connections</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/#pricing">Pricing</Link>
        </nav>
        <div className="nav-actions">
          <a className="text-link" href={`${APP_ORIGIN}/login`}>Sign in</a>
          <a className="button button-primary" href={`${APP_ORIGIN}/register`}>Get started</a>
        </div>
      </div>
    </header>
  );
}
