"use server";

export interface LinkMeta {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  domain: string;
  ogType?: string;
  isVideo?: boolean;
}

/** Fetch Open Graph metadata from a URL. */
export async function fetchLinkMeta(url: string): Promise<LinkMeta | null> {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace(/^www\./, "");

    const res = await fetch(url, {
      // Real browser UA — many sites (BBC, etc.) serve stripped HTML to bots
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });

    if (!res.ok) return { url, domain };

    // Some SPAs (BBC, etc.) put OG tags well past 30KB — scan enough to find them
    const text = await res.text();
    const head = text.slice(0, 50_000);

    const title = extractMeta(head, "og:title") ?? extractTag(head, "title");
    const description = extractMeta(head, "og:description") ?? extractMeta(head, "description");
    const image = extractMeta(head, "og:image");
    const ogType = extractMeta(head, "og:type");
    const ogVideo = extractMeta(head, "og:video") ?? extractMeta(head, "og:video:url");

    // Resolve relative image URLs
    const resolvedImage = image && !image.startsWith("http")
      ? new URL(image, url).href
      : image;

    const isVideo = !!ogVideo || ogType === "video" || ogType?.startsWith("video.") === true;

    return { url, title, description, image: resolvedImage, domain, ogType, isVideo };
  } catch {
    // If fetch fails, still return the domain so the UI isn't empty
    try {
      const domain = new URL(url).hostname.replace(/^www\./, "");
      return { url, domain };
    } catch {
      return null;
    }
  }
}

/**
 * Extract content from <meta property="..." content="..."> or <meta name="..." content="...">.
 * Handles attribute ordering, self-closing tags, and whitespace variations.
 */
function extractMeta(html: string, property: string): string | undefined {
  const esc = escapeRegex(property);
  // Pattern 1: property/name first, then content
  const re1 = new RegExp(
    `<meta\\s[^>]*(?:property|name)\\s*=\\s*["']${esc}["'][^>]*content\\s*=\\s*["']([^"']*)["']`,
    "i",
  );
  // Pattern 2: content first, then property/name
  const re2 = new RegExp(
    `<meta\\s[^>]*content\\s*=\\s*["']([^"']*)["'][^>]*(?:property|name)\\s*=\\s*["']${esc}["']`,
    "i",
  );
  return html.match(re1)?.[1] ?? html.match(re2)?.[1] ?? undefined;
}

/** Extract content from <title>...</title> */
function extractTag(html: string, tag: string): string | undefined {
  const re = new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, "i");
  return html.match(re)?.[1]?.trim();
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Check if a URL points to a valid image via HEAD request + Content-Type. */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    const ct = res.headers.get("content-type");
    return res.ok && !!ct?.startsWith("image/");
  } catch {
    return false;
  }
}

