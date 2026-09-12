const INSTAGRAM_HANDLE_RE = /^@?([A-Za-z0-9._]{1,30})$/;

// Links render as clickable hrefs in the CRM, so only http(s) is ever stored.
export function normalizeHttpUrl(input?: string | null): string | null {
  const value = input?.trim();
  if (!value) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function normalizeInstagram(input?: string | null): string | null {
  const value = input?.trim();
  if (!value) return null;
  const handle = value.match(INSTAGRAM_HANDLE_RE)?.[1];
  return handle ? `https://instagram.com/${handle}` : normalizeHttpUrl(value);
}
