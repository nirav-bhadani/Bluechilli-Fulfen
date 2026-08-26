import type { MetadataRoute } from "next";

/**
 * Site is blocked from search engine indexing.
 * Reinforced by the `X-Robots-Tag` header in next.config and the
 * `robots` metadata in the root layout.
 * TODO(go-live): switch back to allow-all when the client signs off.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
