import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {PostMarkdown} from "../../../components/post-markdown";
import {SiteNav} from "../../../components/site-nav";
import {SiteFooter} from "../../../components/site-footer";
import {GuideVisual} from "../../../components/guide-visual";
import {BLOG_UPDATED, guideBySlug, guides} from "../../../lib/blog";
import {allPosts, postBySlug} from "../../../lib/posts";
import {articleMetadata, serializeJsonLd} from "../../../lib/seo";
import {blogStructuredData} from "../../../lib/structured-blog";
import "../blog.css";
import "../media.css";

type Params = {params: Promise<{slug: string}>};
export function generateStaticParams() {return [...guides, ...allPosts()].map(({slug}) => ({slug}));}
export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {slug} = await params; const article = guideBySlug(slug) ?? postBySlug(slug);
  if (!article) return {};
  const image = "image" in article && article.image ? {
    url: article.image,
    width: 1200,
    height: 631,
    alt: article.imageAlt ?? article.title
  } : undefined;
  const published = "published" in article ? article.published : BLOG_UPDATED;
  const updated = "updated" in article ? article.updated : BLOG_UPDATED;
  const author = "author" in article ? article.author : "Thoufeek Baber";
  return articleMetadata(`/blog/${slug}`, `${article.title} | SceneSmith`, article.description, published, updated, author, image);
}
export default async function GuidePage({params}: Params) {
  const {slug} = await params; const guide = guideBySlug(slug);
  if (!guide) {
    const post = postBySlug(slug); if (!post) notFound();
    const structuredData = blogStructuredData(post);
    return <main className="blog-shell"><script type="application/ld+json" dangerouslySetInnerHTML={{__html: serializeJsonLd(structuredData)}} /><SiteNav /><div className="blog-container"><article className="guide-article">
      <nav className="blog-breadcrumb" aria-label="Breadcrumb"><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span aria-current="page">{post.title}</span></nav>
      <header className="guide-header"><span className="blog-eyebrow">{post.category.toUpperCase()}</span><h1>{post.title}</h1><p className="guide-deck">{post.description}</p><p className="guide-byline">By {post.author} · Updated {post.updated} · {post.readTime}</p></header>
      {post.image && <figure className="blog-post-cover"><img src={post.image} alt={post.imageAlt ?? ""} width="1200" height="631" /></figure>}
      <div className="guide-body markdown-post"><PostMarkdown markdown={post.body} /></div>
    </article><section className="blog-related"><h2>Keep reading</h2><div className="blog-grid">{[...allPosts(), ...guides].filter((item) => item.slug !== slug).slice(0, 3).map((item) => <Link className="blog-card" href={`/blog/${item.slug}`} key={item.slug}><span className="blog-card-category">{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><span className="blog-card-link">Read the guide ↗</span></Link>)}</div></section></div><SiteFooter /></main>;
  }
  const structuredData = blogStructuredData({slug: guide.slug, title: guide.title, description: guide.description, category: guide.category, author: "Thoufeek Baber", published: BLOG_UPDATED, updated: BLOG_UPDATED, faqs: guide.faq});
  return <main className="blog-shell"><script type="application/ld+json" dangerouslySetInnerHTML={{__html: serializeJsonLd(structuredData)}} /><SiteNav /><div className="blog-container"><article className="guide-article">
    <nav className="blog-breadcrumb" aria-label="Breadcrumb"><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span aria-current="page">{guide.title}</span></nav>
    <header className="guide-header"><span className="blog-eyebrow">{guide.category.toUpperCase()}</span><h1>{guide.title}</h1><p className="guide-deck">{guide.description}</p><p className="guide-byline">By Thoufeek Baber · Updated {BLOG_UPDATED} · {guide.readTime}</p></header>
    <GuideVisual guide={guide} />
    <div className="guide-body"><aside className="guide-takeaway"><strong>The short answer</strong><p>{guide.answer}</p></aside>{guide.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="guide-inline-action"><p>Want to try this with your own account?</p><a href={guide.primaryAction.url}>{guide.primaryAction.label} ↗</a><a href={guide.existingAction.url}>{guide.existingAction.label}</a></div>
      {guide.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.steps && <ol>{section.steps.map((step) => <li key={step}>{step}</li>)}</ol>}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}
      <section><h2>Questions people ask</h2>{guide.faq.map(({question, answer}) => <div className="guide-faq" key={question}><h3>{question}</h3><p>{answer}</p></div>)}</section>
      <section className="guide-sources"><h2>Sources and product references</h2><ul>{guide.sources.map(({label, url}) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a></li>)}</ul><p>Product details were checked against SceneSmith source code and public documentation on {BLOG_UPDATED}. Availability may change; confirm the options shown in your workspace before publishing.</p></section>
    </div><aside className="guide-cta"><h2>Ready to put the guide to work?</h2><p>Create a draft, review the destination and timing, then approve the post you want to send.</p><a href={guide.primaryAction.url}>{guide.primaryAction.label} <span aria-hidden="true">↗</span></a><a href={guide.existingAction.url}>{guide.existingAction.label}</a></aside>
  </article><section className="blog-related"><h2>Keep reading</h2><div className="blog-grid">{guides.filter((item) => item.slug !== slug).map((item) => <Link className="blog-card" href={`/blog/${item.slug}`} key={item.slug}><span className="blog-card-category">{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><span className="blog-card-link">Read the guide ↗</span></Link>)}</div></section></div><SiteFooter /></main>;
}
