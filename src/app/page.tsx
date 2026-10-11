import Image from "next/image";
import Link from "next/link";
import {LandingCalendar} from "../components/landing-calendar";
import {LandingPricing} from "../components/landing-pricing";
import {LaunchOfferBanner} from "../components/launch-offer-banner";
import {PlatformMark} from "../components/platform-mark";
import {ScrollReveal} from "../components/scroll-reveal";
import {SceneToPost} from "../components/scene-to-post";
import {plans} from "../lib/marketing-prices";
import {LEGAL} from "../lib/legal";
import {APP_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL} from "../lib/seo";
import "./landing.css";
import "./landing-clean.css";


const APP_ORIGIN = "https://app.scenesmith.design";

// Keep marketing copy fresh after a deploy; avoid a long-lived static HTML cache
// leaving an already-open staging tab on an older pricing or availability state.
export const dynamic = "force-dynamic";

function Brand() {
  return <span className="ed-brand"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 1 47 24 24 47 1 24Z" fill="currentColor"/><path d="m20 15 13 9-13 9Z" fill="#fff"/></svg><span>SceneSmith</span></span>;
}

const faqs = [
  ["How do I get started?", "Create a free account, set up one workspace, and connect up to three X, Instagram, or LinkedIn accounts. Write, save, and preview three drafts before you decide to start a 7-day trial for scheduling or publishing."],
  ["Will it post without my approval?", "Review the content, account, and timing before approving a publish or schedule request. Your calendar keeps track of what is drafted, scheduled, and published."],
  ["Do I need to keep ChatGPT open?", "Once your schedule is confirmed, SceneSmith handles delivery. You can close the conversation and check the delivery status later."],
  ["Which platforms can I connect?", "X, Instagram, and LinkedIn are available now. Each free workspace can connect up to three accounts per channel, and each workspace keeps its connected accounts together so you can choose where each post belongs."],
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {"@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, legalName: LEGAL.operator, url: SITE_URL, logo: `${SITE_URL}/favicon.svg`, email: LEGAL.supportEmail, founder: {"@id": `${SITE_URL}/#founder`}},
    {"@type": "Person", "@id": `${SITE_URL}/#founder`, name: "Thoufeek Baber", jobTitle: "Founder", sameAs: ["https://www.linkedin.com/in/thoufeekx"], worksFor: {"@id": `${SITE_URL}/#organization`}},
    {"@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, description: SITE_DESCRIPTION, publisher: {"@id": `${SITE_URL}/#organization`}, inLanguage: "en"},
    {
      "@type": "SoftwareApplication", "@id": `${SITE_URL}/#app`, name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION,
      applicationCategory: "BusinessApplication", operatingSystem: "Web", publisher: {"@id": `${SITE_URL}/#organization`},
      featureList: ["Publish from ChatGPT, Codex, Cursor and other MCP clients, or from the SceneSmith web composer", "Instagram, X and LinkedIn publishing", "Preview and explicit approval before every post", "Calendar and scheduling", "Workspaces for separate brands", "Free workspace with up to three accounts per channel, three saved drafts, and previews", "Unlimited publishing on paid plans"],
      offers: [{"@type": "Offer", name: "Free workspace", price: "0", priceCurrency: "CAD", url: `${APP_URL}/register`, availability: "https://schema.org/InStock"}, ...(["starter", "pro"] as const).map((code) => ({"@type": "Offer", name: `${code[0]!.toUpperCase()}${code.slice(1)} plan`, price: (plans[code].prices.monthly.amountCents / 100).toFixed(2), priceCurrency: "CAD", url: `${APP_URL}/register?plan=${code}`, availability: "https://schema.org/InStock"}))]
    },
    {"@type": "FAQPage", "@id": `${SITE_URL}/#faq`, mainEntity: faqs.map(([question, answer]) => ({"@type": "Question", name: question, acceptedAnswer: {"@type": "Answer", text: answer}}))}
  ]
};

export default function HomePage() {
  return <main className="ed-home">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData).replace(/</g, "\\u003c")}} />
    <ScrollReveal />
    <a className="ed-skip" href="#product">Skip to content</a>
    <LaunchOfferBanner />
    <header className="ed-nav">
      <Link href="/" aria-label="SceneSmith home"><Brand /></Link>
      <nav className="ed-desktop" aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#calendar">The calendar</a><Link href="/blog">Blog</Link><a href="#pricing">Pricing</a></nav>
      <div className="ed-nav-actions"><a href={`${APP_ORIGIN}/login`} className="ed-sign-in">Sign in</a><a href={`${APP_ORIGIN}/register`} className="ed-button">Get started <span aria-hidden="true">↗</span></a></div>
      <details className="ed-mobile-menu"><summary>Menu <span aria-hidden="true">＋</span></summary><nav aria-label="Mobile navigation"><a href="#how-it-works">How it works</a><a href="/connections">Connections</a><a href="#calendar">The calendar</a><Link href="/blog">Blog</Link><a href="#pricing">Pricing</a><a href={`${APP_ORIGIN}/login`}>Sign in</a></nav></details>
    </header>
    <section className="cl-hero" id="product">
      <div className="cl-platforms" aria-label="Supported channels"><span title="X"><PlatformMark platform="x"/></span><span title="LinkedIn"><PlatformMark platform="linkedin"/></span><span title="Instagram"><PlatformMark platform="instagram"/></span></div>
      <h1>Your publishing layer for <em>ChatGPT.</em></h1>
      <p className="cl-lead">Create, approve, and schedule posts for Instagram, X, and LinkedIn without leaving the conversation. A little more time for your next big idea.</p>
      <div className="cl-cta"><a href={`${APP_ORIGIN}/register`} className="ed-button">Create your next post <span aria-hidden="true">→</span></a><a href="#scene-to-post" className="cl-ghost">Watch it work</a></div>
      <p className="cl-works">Works with <strong>ChatGPT</strong>, <strong>Codex</strong>, <strong>Cursor</strong>, <strong>VS Code</strong> and other MCP clients.</p>
    </section>
    <section className="cl-demo" id="scene-to-post"><SceneToPost /><p className="cl-demo-note"><span>From scene to post: prompt, preview, approve, scheduled.</span><a href="https://scenesmith.design" target="_blank" rel="noopener noreferrer">See it on the original site ↗</a></p></section>
    <div className="cl-stats"><article><strong>3</strong><span>Channels live</span></article><article><strong>1</strong><span>Approval before every post</span></article><article><strong>0</strong><span>Tabs to switch</span></article></div>
    <section className="cl-feature"><div><p className="ed-kicker">Cross-posting</p><h2>One conversation. Every channel.</h2><p>Connect each brand's accounts once, then publish to Instagram, X, and LinkedIn from the same chat. Each workspace keeps its voice, calendar, and destinations together.</p><a href={`${APP_ORIGIN}/register`} className="ed-button">Start posting <span aria-hidden="true">→</span></a></div>
      <div className="cl-hub" aria-label="SceneSmith publishes to X, LinkedIn, and Instagram"><svg viewBox="0 0 100 85" aria-hidden="true"><defs><path id="fl1" d="M24 42.5 C50 42.5 50 18.7 76 18.7"/><path id="fl2" d="M24 42.5 L76 42.5"/><path id="fl3" d="M24 42.5 C50 42.5 50 66.3 76 66.3"/></defs><g stroke="#cfd9d1" strokeWidth="0.5" fill="none"><use href="#fl1"/><use href="#fl2"/><use href="#fl3"/></g>{["fl1","fl2","fl3"].flatMap((id,i)=>[0,1.2].map((d)=><circle key={id+d} className="cl-flow" r="1.1" fill="#3f8a5f"><animateMotion dur="3.6s" begin={`${i*0.5+d}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.2 1"><mpath href={`#${id}`}/></animateMotion><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="3.6s" begin={`${i*0.5+d}s`} repeatCount="indefinite"/></circle>))}</svg><span className="cl-node hub" style={{left:"24%",top:"50%"}}><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 1 47 24 24 47 1 24Z" fill="currentColor"/><path d="m20 15 13 9-13 9Z" fill="#183c2b"/></svg></span><span className="cl-node" style={{left:"76%",top:"22%"}}><PlatformMark platform="x"/><small>X</small></span><span className="cl-node" style={{left:"76%",top:"50%"}}><PlatformMark platform="linkedin"/><small>LinkedIn</small></span><span className="cl-node" style={{left:"76%",top:"78%"}}><PlatformMark platform="instagram"/><small>Instagram</small></span></div></section>
    <section className="ed-section" id="how-it-works"><div className="ed-heading"><p className="ed-kicker">How it works</p><h2>From idea to published in three steps.</h2><p>Bring the spark. Shape it in conversation. SceneSmith takes care of what comes next.</p></div>
      <div className="ed-steps"><article><span>01 / CREATE</span><h3>Start with a thought.</h3><p>A launch, a story, or a photo you love. Turn it into an X, Instagram, or LinkedIn post in ChatGPT, or write it right in the SceneSmith app.</p></article><article><span>02 / APPROVE</span><h3>Make it feel like you.</h3><p>See the words, media, and account together. Refine the details, then give your approval.</p></article><article><span>03 / PUBLISH</span><h3>Send it into the world.</h3><p>Publish now or choose the right time. Come back to a clear record of what went live.</p></article></div>
      <div className="ed-connection-guide"><div><p className="ed-kicker">Connections</p><h3>Bring SceneSmith into the tools you already use.</h3><p>Connect ChatGPT, Codex, Cursor, VS Code, Devin, and other MCP-compatible clients to the same hosted SceneSmith server. Your account and social destinations stay under your control.</p></div><Link className="ed-button" href="/connections">Read the connection docs <span aria-hidden="true">→</span></Link></div>
    </section>
    <section className="ed-calendar-section" id="calendar"><div className="ed-calendar-copy"><p className="ed-kicker">A rhythm of your own</p><h2>Your social<br/>story, together.</h2><p>A home for what you’re dreaming up, what’s on its way, and what you’ve already shared.</p><p>Move through the months. Open a post. See the whole picture.</p><div className="ed-legend"><span><i className="published"/>Published</span><span><i className="scheduled"/>Scheduled</span><span><i className="draft"/>Draft</span></div><a className="ed-link" href={`${APP_ORIGIN}/login?next=%2Fapp%2Factivity`}>Open your calendar ↗</a></div><LandingCalendar /></section>
    <section className="ed-section cl-platforms-section" id="platforms"><div className="ed-heading"><h2>Supported platforms</h2><p>These are the platforms you can publish to from SceneSmith. All live today.</p></div><div className="cl-platform-grid"><article><span className="cl-logo x"><PlatformMark platform="x"/></span><strong>X</strong></article><article><span className="cl-logo ig"><PlatformMark platform="instagram"/></span><strong>Instagram</strong></article><article><span className="cl-logo li"><PlatformMark platform="linkedin"/></span><strong>LinkedIn</strong></article><article className="more"><span className="cl-logo more-dots" aria-hidden="true">···</span><strong>More to come</strong></article></div></section>
    <LandingPricing />
    <section className="cl-founder" id="founder"><div className="cl-founder-card"><Image className="cl-founder-photo" src="/founder.jpg" alt="Thoufeek Baber, founder of SceneSmith" width={96} height={96}/><h2>heyo! it&apos;s <em>Thoufeek</em></h2><p className="cl-founder-sub">(the guy who made SceneSmith)</p>
      <p>I&apos;m a <strong>solo founder building in Canada</strong>. I use <strong>ChatGPT, Codex</strong> and other AI tools every single day to research, write, and ship.</p>
      <p>What I couldn&apos;t find was a platform that let me <strong>automate publishing my content</strong> straight from those conversations, without copying drafts between tabs and dashboards.</p>
      <p>So I built it. SceneSmith is the publishing layer I wanted: create in the chat, approve, schedule, done. If you have a question or an idea, I&apos;d love to hear it.</p>
      <div className="cl-founder-actions"><a className="ed-button" href="https://cal.com/thoufeek-baber" target="_blank" rel="noopener noreferrer">Book a call with me <span aria-hidden="true">→</span></a><a className="cl-ghost" href="https://www.linkedin.com/in/thoufeekx" target="_blank" rel="noopener noreferrer">Connect on LinkedIn ↗</a></div></div></section>
    <section className="ed-section ed-faq"><div><p className="ed-kicker">Good to know</p><h2>A few things,<br/>before you begin.</h2><Link className="ed-link" href="/support">A little more help ↗</Link></div><div>{faqs.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">＋</span></summary><p>{a}</p></details>)}</div></section>
    <section className="ed-final"><p className="ed-kicker">Create. Share. Belong.</p><h2>Good ideas<br/><em>travel further.</em></h2><p>Let’s put yours out there.</p><a href={`${APP_ORIGIN}/register`} className="ed-button">Get started with SceneSmith <span aria-hidden="true">↗</span></a></section>
    <footer className="ed-footer"><div><Link href="/" aria-label="SceneSmith home"><Brand /></Link><p>Social publishing for a brighter tomorrow.</p></div><nav aria-label="Footer"><Link href="#pricing">Pricing</Link><Link href="/support">Support</Link><Link href="/connections">Connections</Link><Link href="/blog">Blog</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/security">Security</Link><Link href="/data-deletion">Data deletion</Link></nav><p className="ed-copyright">© {new Date().getFullYear()} SceneSmith. Made for your next idea.</p></footer>
  </main>;
}
