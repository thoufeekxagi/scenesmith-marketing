import type {PostFaq} from "./post-faq.mjs";
import type {MarkdownPost} from "./posts";
import {videoObjectSchema} from "./video-schema.mjs";
import {SITE_URL} from "./seo";

type BlogStructuredData = {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  published: string;
  updated: string;
  image?: string;
  faqs?: PostFaq[];
  videos?: MarkdownPost["videos"];
};

export function blogStructuredData(article: BlogStructuredData) {
  const url = `${SITE_URL}/blog/${article.slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: article.title,
      description: article.description,
      articleSection: article.category,
      datePublished: article.published,
      dateModified: article.updated,
      author: {"@type": "Person", name: article.author},
      publisher: {"@type": "Organization", name: "SceneSmith", url: SITE_URL},
      mainEntityOfPage: url,
      ...(article.image ? {image: new URL(article.image, SITE_URL).toString()} : {})
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: [
        {"@type": "ListItem", position: 1, name: "Blog", item: `${SITE_URL}/blog`},
        {"@type": "ListItem", position: 2, name: article.title, item: url}
      ]
    }
  ];

  graph.push(...videoObjectSchema(url, article.videos ?? []));

  if (article.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: article.faqs.map(({question, answer}) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {"@type": "Answer", text: answer}
      }))
    });
  }

  return {"@context": "https://schema.org", "@graph": graph};
}
