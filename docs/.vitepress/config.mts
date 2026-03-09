import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Outilx",
  description: "Modern utility library collection for JavaScript/TypeScript",
  base: "/outilx/",
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/outilx/favicon.svg' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "API", link: "/api/" },
      {
        text: "Packages",
        items: [
          { text: "@outilx/core", link: "/api/core/" },
          { text: "@outilx/browser", link: "/api/browser/" },
          { text: "@outilx/node", link: "/api/node/" },
          { text: "@outilx/react-hooks", link: "/api/react-hooks/" },
          { text: "@outilx/ai", link: "/api/ai/" },
        ],
      },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Introduction",
          items: [
            { text: "Getting Started", link: "/guide/" },
            { text: "Installation", link: "/guide/installation" },
          ],
        },
        {
          text: "Packages",
          items: [
            { text: "Core", link: "/guide/core" },
            { text: "Browser", link: "/guide/browser" },
            { text: "Node.js", link: "/guide/node" },
            { text: "React Hooks", link: "/guide/react-hooks" },
            { text: "AI", link: "/guide/ai" },
          ],
        },
      ],
      "/api/": [
        {
          text: "Overview",
          items: [{ text: "API Reference", link: "/api/" }],
        },
        {
          text: "@outilx/core",
          items: [
            { text: "Overview", link: "/api/core/" },
            { text: "Array", link: "/api/core/array" },
            { text: "Cache", link: "/api/core/cache" },
            { text: "JSON", link: "/api/core/json" },
            { text: "URL", link: "/api/core/url" },
            { text: "Config", link: "/api/core/config" },
            { text: "Async", link: "/api/core/async" },
            { text: "Similarity", link: "/api/core/similarity" },
          ],
        },
        {
          text: "@outilx/browser",
          items: [
            { text: "Overview", link: "/api/browser/" },
            { text: "Network", link: "/api/browser/network" },
            { text: "Storage", link: "/api/browser/storage" },
            { text: "Timer", link: "/api/browser/timer" },
          ],
        },
        {
          text: "@outilx/node",
          items: [
            { text: "Overview", link: "/api/node/" },
            { text: "File Operations", link: "/api/node/file-operations" },
            { text: "Directory", link: "/api/node/directory" },
            { text: "Repository", link: "/api/node/repository" },
          ],
        },
        {
          text: "@outilx/react-hooks",
          items: [
            { text: "Overview", link: "/api/react-hooks/" },
            { text: "State Management", link: "/api/react-hooks/state" },
            { text: "Storage", link: "/api/react-hooks/storage" },
            { text: "Performance", link: "/api/react-hooks/performance" },
            { text: "Lifecycle", link: "/api/react-hooks/lifecycle" },
            { text: "Async", link: "/api/react-hooks/async" },
            { text: "Utilities", link: "/api/react-hooks/utilities" },
          ],
        },
        {
          text: "@outilx/ai",
          items: [
            { text: "Overview", link: "/api/ai/" },
            { text: "Code Detection", link: "/api/ai/code-detection" },
            { text: "Streaming", link: "/api/ai/streaming" },
            { text: "SSE", link: "/api/ai/sse" },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/Sunny-117/outilx" },
    ],
    search: {
      provider: "local",
    },
  },
});
