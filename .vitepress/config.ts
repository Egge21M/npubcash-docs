import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "npubcash-docs",
  description: "Documentation for the npubcash API",
  base: "/npubcash-docs/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "General",
        items: [{ text: "How does it work", link: "/docs/how-does-it-work" }],
      },
      {
        text: "API",
        items: [{ text: "Runtime API Examples", link: "/api-examples" }],
      },
      {
        text: "npubcash-server",
        items: [{ text: "Deployment", link: "/api-examples" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
