import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/partner/area-partner"],
    },
    sitemap: "https://vetrina.it/sitemap.xml",
  };
}
