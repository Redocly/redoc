export function stripFormatting(text: string | Record<string, any> | null): string {
  const _text = typeof text === 'string' ? text : text?.raw || '';

  return [
    /<[^>]*>/g, // HTML tags
    /```[\s\S]*?```/g, // Code blocks
    /`([^`]+)`/g, // Inline code
    /\*\*(.*?)\*\*/g, // Bold
    /\*(.*?)\*/g, // Italic
  ].reduce((text, pattern) => text.replace(pattern, ''), _text);
}
