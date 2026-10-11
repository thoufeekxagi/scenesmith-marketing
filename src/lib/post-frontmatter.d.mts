export type PostMetadata = Record<string, string>;
export type ParsedPost = {data: PostMetadata; content: string};
export function parsePostSource(source: string): ParsedPost;
