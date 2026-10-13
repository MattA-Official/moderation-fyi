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

Please read our [AI usage policy](content/pages/ai-policy.md) first: AI tools are fine for website code, but guides, templates and articles must be written by you.

## Development

The site is built with [Nuxt 4](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com) and [Nuxt Content](https://content.nuxt.com), and is deployed to Cloudflare Workers. We use [Bun](https://bun.sh):

```bash
bun install      # install dependencies
bun run dev      # start the dev server on http://localhost:3000
bun run lint     # lint (add :fix to autofix)
bun run typecheck
bun run check:content  # check topic, platform and compliance IDs
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
| `content/topics/`    | One YAML file per topic: a `label` and a one-line `description` | none yet |

The front matter fields for each collection are defined in `content.config.ts`, and the `example.md` file in each folder shows them all in use.

### Topics and platforms

Guides, templates and articles share two ways of saying what they're about:

- **`topics`** lists topic IDs, which are the file names in `content/topics/` (for example `raids` for `raids.yml`). To add a topic, add a file there. `bun run check:content` warns about any page that names a topic with no file.
- **`platforms`** lists platform IDs from `shared/taxonomy.ts` (for example `discord`). These are fixed: `bun run check:content` reports an unknown one as an error. To add a platform, add it to that file.

### Templates with several snippets

A template page shows its whole body as one copyable sheet. When a template holds several pieces of text that people copy separately (a warning, a timeout notice and a ban message, say), wrap each one in a `template-snippet` block with a unique title. Text outside the blocks is shown as guidance around them, and each snippet gets its own copy button.

```md
Send this when you warn a member.

::template-snippet{title="Warning"}
Hi {name}, this is a warning for breaking rule {number}.
::
```

On a template with snippets, the page's Copy and Download buttons give every snippet, each under its title.

### Placeholders

Write the parts a reader should fill in as placeholders in curly brackets, like `{server name}` (not square brackets: Markdown treats `[square brackets]` as link text and drops them). On the page each placeholder is highlighted and can be typed into where it sits (or filled in from the "Fill in the blanks" box beside the template); a value fills that placeholder everywhere it appears, and Copy, Download and the Markdown view give the filled-in text. To have two placeholders with the same label filled in separately, tag them: `{name:a}` and `{name:b}` both show as "name" (with a small a or b) and take their own values, while every plain `{name}` shares one. Tags are letters or numbers. Placeholders in code stay as written, and on a template with snippets only the snippets have them.

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
