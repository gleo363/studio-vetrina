import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vetrina.it";
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/esempi`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/esempi/ristorante`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/esempi/salone`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/esempi/bottega`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/esempi/studio`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/studio`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/perche-sceglierci`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contatti`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/partner`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
