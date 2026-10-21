export type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'bold' | 'code'; value: string }
  | { type: 'link'; value: string; href: string };

const PATTERN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g;

export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;
  for (const match of text.matchAll(PATTERN)) {
    if (match.index > last) tokens.push({ type: 'text', value: text.slice(last, match.index) });
    const [, bold, label, href, code] = match;
    if (bold) tokens.push({ type: 'bold', value: bold });
    else if (label) tokens.push({ type: 'link', value: label, href });
    else tokens.push({ type: 'code', value: code });
    last = match.index + match[0].length;
  }
  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });
  return tokens;
}

// The text without markup, for JSON-LD.
export function plainText(text: string): string {
  return parseInline(text).map((token) => token.value).join('');
}
