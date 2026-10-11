import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {SiteNav} from "../../components/site-nav";
import {SiteFooter} from "../../components/site-footer";
import {BLOG_UPDATED, guides} from "../../lib/blog";
import {pageMetadata} from "../../lib/seo";
import "./blog.css";

export const metadata: Metadata = pageMetadata("/blog", "SceneSmith Blog: ChatGPT Social Publishing Guides", "Practical guides to creating, reviewing, scheduling, and publishing Instagram, X, and LinkedIn posts from ChatGPT.");

export default function BlogPage() {
  return <main className="blog-shell"><SiteNav />
    <div className="blog-container">
      <header className="blog-hero"><span className="blog-eyebrow">THE SCENESMITH JOURNAL</span><h1>Better ideas, <em>beautifully published.</em></h1><p>Practical guides for turning a conversation into social posts you can review, schedule, and trust.</p><p className="blog-updated">Guides checked {BLOG_UPDATED}</p></header>
      <div className="blog-hero-image"><Image src="/blog/editorial-flow.png" alt="Editorial illustration of a draft, calendar, and approved social post linked by hand-drawn lines" fill priority sizes="(max-width: 760px) 100vw, 1100px" /></div>
      <section className="blog-list" aria-labelledby="latest-guides"><div className="blog-section-heading"><span className="blog-eyebrow">START HERE</span><h2 id="latest-guides">Guides for the work you do now</h2><p>Each guide explains the task, the limits, and the next step in SceneSmith.</p></div><div className="blog-grid">{guides.map((guide, index) => <Link className="blog-card" href={`/blog/${guide.slug}`} key={guide.slug}><span className="blog-card-number">0{index + 1}</span><span className="blog-card-category">{guide.category} · {guide.readTime}</span><h3>{guide.title}</h3><p>{guide.description}</p><span className="blog-card-link">Read the guide <span aria-hidden="true">↗</span></span></Link>)}</div></section>
      <aside className="blog-cta"><span className="blog-eyebrow">PUT IT INTO PRACTICE</span><h2>From a good draft to a scheduled post.</h2><p>Connect your accounts, preview the exact content, and approve what goes out.</p><a href="https://app.scenesmith.design/register">Get started with SceneSmith <span aria-hidden="true">↗</span></a></aside>
    </div><SiteFooter /></main>;
}
