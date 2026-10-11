export type PostFaq = {question: string; answer: string};
export function extractPostFaq(markdown: string): PostFaq[];
