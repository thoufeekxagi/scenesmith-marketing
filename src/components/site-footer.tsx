import Link from "next/link";
import {SceneSmithBrand} from "./brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/" aria-label="SceneSmith home"><SceneSmithBrand className="brand-lockup" /></Link>
      <div className="footer-links">
        <Link href="/support">Support</Link>
        <Link href="/connections">Connections</Link>
        <Link href="/mcp">Connect with MCP</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/security">Security</Link>
        <Link href="/data-deletion">Data deletion</Link>
      </div>
    </footer>
  );
}
