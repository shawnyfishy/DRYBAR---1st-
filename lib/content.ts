/**
 * Content helper utilities to prevent placeholder markers (e.g. TODO_)
 * from ever rendering to end users in production.
 */

export function isPlaceholder(value?: string | null): boolean {
  if (!value) return false;
  return value.trim().startsWith('TODO_');
}

export function safeText(value: string, fallback: string): string {
  return isPlaceholder(value) ? fallback : value;
}
