/**
 * Read the FAQ block from a post's Markdown so the visible answers and
 * FAQPage JSON-LD always come from the same source.
 */
export function extractPostFaq(markdown) {
  const faqHeading = /^##\s+[^\r\n]*(?:faq|questions?)[^\r\n]*\r?\n/im.exec(markdown);
  if (!faqHeading) return [];

  const sectionStart = faqHeading.index + faqHeading[0].length;
  const remainder = markdown.slice(sectionStart);
  const nextSection = /^##\s+/m.exec(remainder);
  const section = nextSection ? remainder.slice(0, nextSection.index) : remainder;
  const questionHeadings = [...section.matchAll(/^###\s+([^\r\n]+)\r?$/gm)];

  return questionHeadings.map((heading, index) => {
    const answerStart = heading.index + heading[0].length;
    const answerEnd = questionHeadings[index + 1]?.index ?? section.length;
    const answer = section.slice(answerStart, answerEnd)
      .trim()
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/(`+)(.*?)\1/g, "$2")
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(^|\s)[*_~](.+?)[*_~](?=\s|$)/g, "$1$2")
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/\s+/g, " ")
      .trim();

    return {question: heading[1].trim(), answer};
  });
}
