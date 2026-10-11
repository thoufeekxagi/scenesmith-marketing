import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {SiteNav} from "../../../components/site-nav";
import {SiteFooter} from "../../../components/site-footer";
import {GuideVisual} from "../../../components/guide-visual";
import {BLOG_UPDATED, guideBySlug, guides} from "../../../lib/blog";
import {allPosts, postBySlug, postHtml} from "../../../lib/posts";
import {SITE_URL, pageMetadata} from "../../../lib/seo";
import "../blog.css";

type Params = {params: Promise<{slug: string}>};
export function generateStaticParams() {return [...guides, ...allPosts()].map(({slug}) => ({slug}));}
export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {slug} = await params; const article = guideBySlug(slug) ?? postBySlug(slug);
  return article ? pageMetadata(`/blog/${slug}`, `${article.title} | SceneSmith`, article.description) : {};
}
export default async function GuidePage({params}: Params) {
  const {slug} = await params; const guide = guideBySlug(slug);
  if (!guide) {
    const post = postBySlug(slug); if (!post) notFound();
    const url = `${SITE_URL}/blog/${post.slug}`;
    const html = await postHtml(post);
    const structuredData = {"@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.description, datePublished: post.published, dateModified: post.updated, author: {"@type": "Person", name: post.author}, publisher: {"@type": "Organization", name: "SceneSmith", url: SITE_URL}, mainEntityOfPage: url};
    return <main className="blog-shell"><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData).replace(/</g, "\\u003c")}} /><SiteNav /><div className="blog-container"><article className="guide-article">
      <nav className="blog-breadcrumb" aria-label="Breadcrumb"><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span>{post.category}</span></nav>
      <header className="guide-header"><span className="blog-eyebrow">{post.category.toUpperCase()}</span><h1>{post.title}</h1><p className="guide-deck">{post.description}</p><p className="guide-byline">By {post.author} · Updated {post.updated} · {post.readTime}</p></header>
      <div className="guide-body markdown-post" dangerouslySetInnerHTML={{__html: html}} />
    </article><section className="blog-related"><h2>Keep reading</h2><div className="blog-grid">{[...allPosts(), ...guides].filter((item) => item.slug !== slug).slice(0, 3).map((item) => <Link className="blog-card" href={`/blog/${item.slug}`} key={item.slug}><span className="blog-card-category">{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><span className="blog-card-link">Read the guide ↗</span></Link>)}</div></section></div><SiteFooter /></main>;
  }
  const url = `${SITE_URL}/blog/${guide.slug}`;
  const structuredData = {"@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, datePublished: BLOG_UPDATED, dateModified: BLOG_UPDATED, author: {"@type": "Person", name: "Thoufeek Baber"}, publisher: {"@type": "Organization", name: "SceneSmith", url: SITE_URL}, mainEntityOfPage: url};
  return <main className="blog-shell"><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData).replace(/</g, "\\u003c")}} /><SiteNav /><div className="blog-container"><article className="guide-article">
    <nav className="blog-breadcrumb" aria-label="Breadcrumb"><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span>{guide.category}</span></nav>
    <header className="guide-header"><span className="blog-eyebrow">{guide.category.toUpperCase()}</span><h1>{guide.title}</h1><p className="guide-deck">{guide.description}</p><p className="guide-byline">By Thoufeek Baber · Updated {BLOG_UPDATED} · {guide.readTime}</p></header>
    <GuideVisual guide={guide} />
    <div className="guide-body"><aside className="guide-takeaway"><strong>The short answer</strong><p>{guide.answer}</p></aside>{guide.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="guide-inline-action"><p>Want to try this with your own account?</p><a href={guide.primaryAction.url}>{guide.primaryAction.label} ↗</a><a href={guide.existingAction.url}>{guide.existingAction.label}</a></div>
      {guide.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.steps && <ol>{section.steps.map((step) => <li key={step}>{step}</li>)}</ol>}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}
      <section><h2>Questions people ask</h2>{guide.faq.map(({question, answer}) => <div className="guide-faq" key={question}><h3>{question}</h3><p>{answer}</p></div>)}</section>
      <section className="guide-sources"><h2>Sources and product references</h2><ul>{guide.sources.map(({label, url}) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a></li>)}</ul><p>Product details were checked against SceneSmith source code and public documentation on {BLOG_UPDATED}. Availability may change; confirm the options shown in your workspace before publishing.</p></section>
    </div><aside className="guide-cta"><h2>Ready to put the guide to work?</h2><p>Create a draft, review the destination and timing, then approve the post you want to send.</p><a href={guide.primaryAction.url}>{guide.primaryAction.label} <span aria-hidden="true">↗</span></a><a href={guide.existingAction.url}>{guide.existingAction.label}</a></aside>
  </article><section className="blog-related"><h2>Keep reading</h2><div className="blog-grid">{guides.filter((item) => item.slug !== slug).map((item) => <Link className="blog-card" href={`/blog/${item.slug}`} key={item.slug}><span className="blog-card-category">{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><span className="blog-card-link">Read the guide ↗</span></Link>)}</div></section></div><SiteFooter /></main>;
}
