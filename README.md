# moderation.fyi

Practical moderation guides for volunteer community moderators. Open-source and community-driven.

## About

Our mission is to build a community-driven knowledge base to help moderators on platforms like Discord, Reddit, and Twitch to manage safer and more engaging communities. This project is fully open-source and welcomes contributions from the community.

**🚧 This project is currently in development and coming soon!**

## Features

- 🎯 **Practical Guides**: Real-world moderation scenarios and solutions
- 🤝 **Community-Driven**: Built by moderators, for moderators
- 🌐 **Multi-Platform**: Covers Discord, Reddit, Twitch, and more
- 📚 **Knowledge Base**: Searchable repository of moderation best practices
- 🔧 **Open Source**: Fully transparent and open to contributions

## Contributing

We welcome contributions from the community! Whether you're a seasoned moderator with insights to share or a developer looking to improve the website, there are many ways to get involved. Fork the repository to get started!

## Development

The site is built with [Nuxt 4](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com) and [Nuxt Content](https://content.nuxt.com), and is deployed to Cloudflare Workers. We use [Bun](https://bun.sh):

```bash
bun install      # install dependencies
bun run dev      # start the dev server on http://localhost:3000
bun run lint     # lint (add :fix to autofix)
bun run typecheck
bun run build    # production build
bun run preview  # preview the production build
```

## Writing content

All content lives in `content/` as Markdown, and can also be edited visually through Nuxt Studio at `/_studio`.

| Folder               | What goes there                                        | URL               |
| -------------------- | ------------------------------------------------------ | ----------------- |
| `content/guides/`    | Step-by-step guides                                    | `/guides/<file>`    |
| `content/templates/` | Copy-and-paste templates (copy and download buttons)   | `/templates/<file>` |
| `content/articles/`  | Articles, case studies and opinion (also in `/rss.xml`) | `/articles/<file>`  |
| `content/pages/`     | Standalone pages: about, contribute, privacy, terms    | `/<file>`           |
| `content/authors/`   | One file per author: a bio, or a `link` to their own site | `/authors/<file>` (bio only) |

The front matter fields for each collection are defined in `content.config.ts`, and the `example.md` file in each folder shows them all in use.

## Design

The look and voice follow the moderation.fyi design system. Its tokens live as CSS variables in `app/assets/css/main.css` (light and dark), are mapped onto Nuxt UI's colours in `app/app.config.ts`, and its fonts (Source Serif 4 and Atkinson Hyperlegible Next) are self-hosted from `public/fonts/`. Shared component classes are prefixed `mf-`.

## Configuration

- **Social links, repository and "edit this page" branch:** `app/app.config.ts`
- **External links:** every link off the site asks the reader to confirm first, except the links listed in `site.trustedLinks` in `app/app.config.ts` (the repository and the moderation.fyi GitHub organisation).
- **Newsletter:** `POST /api/subscribe` stores sign-ups in the `subscribers` table of the `DB` D1 database (the table is created automatically). In development it uses a local SQLite file in `.data/`.
- **Branch previews:** pushes to any branch other than the production branch are deployed as [Worker Previews](https://developers.cloudflare.com/workers/previews/) at `<branch>.preview.moderation.fyi` (for example `dev.preview.moderation.fyi`). Previews use a separate D1 database (`previews` in the Wrangler config in `nuxt.config.ts`) and are hidden from search engines.
- **Nuxt Studio:** production editing requires the Studio GitHub OAuth environment variables. See the [Studio docs](https://content.nuxt.com/docs/studio/setup).

## Contact

For questions or suggestions, feel free to reach out through our GitHub issues or discussions.

---

*Building safer communities, one guide at a time.*
