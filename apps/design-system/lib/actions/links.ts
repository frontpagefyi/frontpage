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

/** oEmbed endpoints for known video platforms. */
const OEMBED_ENDPOINTS: { pattern: RegExp; endpoint: string }[] = [
  { pattern: /(?:youtube\.com|youtu\.be)/, endpoint: "https://www.youtube.com/oembed?format=json&url=" },
  { pattern: /vimeo\.com/, endpoint: "https://vimeo.com/api/oembed.json?url=" },
  { pattern: /dailymotion\.com|dai\.ly/, endpoint: "https://www.dailymotion.com/services/oembed?format=json&url=" },
  { pattern: /tiktok\.com/, endpoint: "https://www.tiktok.com/oembed?url=" },
];

/** URL patterns that are always video, even if OG/oEmbed fail. */
const VIDEO_URL_PATTERNS = [
  /(?:youtube\.com\/(?:watch|shorts|live|embed)|youtu\.be\/)/,
  /vimeo\.com\/\d+/,
  /(?:dailymotion\.com\/video|dai\.ly\/)/,
  /tiktok\.com\/@[^/]+\/video\//,
  /twitch\.tv\/(?:videos\/\d+|[^/]+\/clip\/)/,
  /clips\.twitch\.tv\//,
];

function isKnownVideoUrl(url: string): boolean {
  return VIDEO_URL_PATTERNS.some((p) => p.test(url));
}

/** Try oEmbed to detect video and get metadata (works for JS-heavy sites like YouTube). */
async function tryOEmbed(url: string): Promise<{
  isVideo: boolean; title?: string; thumbnail?: string;
} | null> {
  const match = OEMBED_ENDPOINTS.find((e) => e.pattern.test(url));
  if (!match) return null;
  try {
    const res = await fetch(match.endpoint + encodeURIComponent(url), {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      isVideo: data.type === "video",
      title: data.title,
      thumbnail: data.thumbnail_url,
    };
  } catch {
    return null;
  }
}

/** Fetch Open Graph metadata from a URL. */
export async function fetchLinkMeta(url: string): Promise<LinkMeta | null> {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace(/^www\./, "");

    // Run oEmbed and page fetch in parallel to avoid doubling latency
    const [oembed, res] = await Promise.all([
      tryOEmbed(url),
      fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(8000),
        redirect: "follow",
      }).catch(() => null),
    ]);

    if (!res?.ok) {
      // Page fetch failed — fall back to oEmbed / URL pattern
      if (oembed) {
        return { url, title: oembed.title, image: oembed.thumbnail, domain, isVideo: oembed.isVideo };
      }
      return { url, domain, isVideo: isKnownVideoUrl(url) };
    }

    // Some SPAs (BBC, etc.) put OG tags well past 30KB — scan enough to find them
    const text = await res.text();
    const head = text.slice(0, 50_000);

    const title = extractMeta(head, "og:title") ?? extractTag(head, "title") ?? oembed?.title;
    const description = extractMeta(head, "og:description") ?? extractMeta(head, "description");
    const image = extractMeta(head, "og:image");
    const ogType = extractMeta(head, "og:type");
    const ogVideo = extractMeta(head, "og:video") ?? extractMeta(head, "og:video:url");

    // Resolve relative image URLs
    const resolvedImage = image && !image.startsWith("http")
      ? new URL(image, url).href
      : (image ?? oembed?.thumbnail);

    const isVideo = !!ogVideo
      || ogType === "video" || ogType?.startsWith("video.") === true
      || (oembed?.isVideo ?? false)
      || isKnownVideoUrl(url);

    return { url, title, description, image: resolvedImage, domain, ogType, isVideo };
  } catch {
    // If everything fails, still return the domain so the UI isn't empty
    try {
      const domain = new URL(url).hostname.replace(/^www\./, "");
      return { url, domain, isVideo: isKnownVideoUrl(url) };
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

