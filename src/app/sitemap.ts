import type { MetadataRoute } from "next";

const BASE = "https://heardhospitalitygroup.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/about-heard-hospitality-group`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/ai-revenue-systems`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/hospitality-ai-consulting`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/heard-os`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/contract-forge`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
  ];
}
