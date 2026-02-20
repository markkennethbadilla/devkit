import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tools.elunari.uk";
  const tools = [
    "",
    "/json-formatter",
    "/base64",
    "/url-encoder",
    "/uuid-generator",
    "/hash-generator",
    "/jwt-decoder",
    "/color-converter",
    "/regex-tester",
    "/lorem-ipsum",
    "/diff-checker",
    "/markdown-preview",
    "/timestamp-converter",
    "/css-minifier",
    "/html-entity-encoder",
    "/word-counter",
    "/text-case-converter",
    "/password-generator",
    "/json-to-csv",
    "/number-base-converter",
    "/sql-formatter",
    "/cron-parser",
    "/yaml-to-json",
    "/image-to-base64",
    "/html-to-markdown",
    "/text-sort-dedupe",
    "/privacy",
  ];

  return tools.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
