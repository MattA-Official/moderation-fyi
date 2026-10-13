<script setup lang="ts">
const { site } = useAppConfig()

const { data: guides } = await useAsyncData('home-guides', () => queryCollection('guides')
  .select('title', 'description', 'path', 'difficulty', 'platforms', 'featured', 'publishedAt')
  .order('publishedAt', 'DESC')
  .limit(3)
  .all())

const { data: templates } = await useAsyncData('home-templates', () => queryCollection('templates')
  .select('title', 'description', 'path', 'templateType', 'platforms', 'featured', 'publishedAt')
  .order('publishedAt', 'DESC')
  .limit(3)
  .all())

const { data: articles } = await useAsyncData('home-articles', () => queryCollection('articles')
  .select('title', 'description', 'path', 'date')
  .order('date', 'DESC')
  .limit(3)
  .all())

const quickSearches = [
  { label: 'A raid in progress', q: 'raid' },
  { label: 'Writing server rules', q: 'rules' },
  { label: 'Handling ban appeals', q: 'ban appeal' },
  { label: 'Mod burnout', q: 'burnout' },
]

const platforms = ['Discord servers', 'subreddits', 'Twitch channels', 'Matrix rooms', 'forums', 'group chats']

const principles = [
  { title: 'Useful first', description: 'The first sentence tells you what to do. The theory can wait.', icon: 'i-lucide-list-checks' },
  { title: 'Mod to mod', description: 'Written by peers with a few more reps, not gurus or corporate trainers.', icon: 'i-lucide-messages-square' },
  { title: 'Honest about the work', description: 'We name the hard parts, cite our sources and say what we don\'t know.', icon: 'i-lucide-scale' },
  { title: 'Free and open', description: 'No paywalls, no accounts, no tracking. Everything lives on GitHub.', icon: 'i-lucide-heart-handshake' },
]

const entryPoints = [
  {
    icon: 'i-lucide-book-open',
    title: 'Guides',
    description: 'Step-by-step answers to the situations mods actually face: writing rules, handling a raid, calming a heated thread.',
    to: '/guides',
    link: 'Browse the guides',
  },
  {
    icon: 'i-lucide-file-text',
    title: 'Templates',
    description: 'Rules, removal reasons, ban messages and appeal forms you can copy, paste and adapt in a few minutes.',
    to: '/templates',
    link: 'Browse the templates',
  },
  {
    icon: 'i-lucide-newspaper',
    title: 'Articles',
    description: 'Longer reads: what other mod teams tried, what worked, and what they\'d do differently.',
    to: '/articles',
    link: 'Read the articles',
  },
]

useSeoMeta({
  title: 'Practical moderation guides for volunteer mods',
  description: 'Free, open-source guides and templates for volunteer moderators on Discord, Reddit, Twitch and beyond, written by mods who\'ve done the job.',
})
</script>

<template>
  <div>
    <div class="mx-auto max-w-page px-4 md:px-8">
      <section class="pt-12 md:pt-20 pb-12 md:pb-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
        <div class="max-w-measure-wide space-y-6">
          <span class="mf-eyebrow">
            <UIcon
              name="i-lucide-sparkles"
              class="size-4"
              aria-hidden="true"
            />
            Free, open source and written by mods
          </span>
          <h1 class="mf-display text-pretty">
            Moderation, written by <span class="mf-highlight">people who've done it.</span>
          </h1>
          <p class="mf-lede">
            Practical guides and copy-and-paste templates for volunteer mods. For the midnight raid, the awkward ban appeal and everything in between.
          </p>
          <SearchForm large />
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-sans text-sm text-mf-ink-muted me-1">Or jump to:</span>
            <NuxtLink
              v-for="search in quickSearches"
              :key="search.q"
              :to="{ path: '/search', query: { q: search.q } }"
              class="mf-chip"
            >
              {{ search.label }}
            </NuxtLink>
          </div>
        </div>

        <aside
          aria-label="Where it works"
          class="rounded-[14px] border border-mf-rule bg-mf-paper-raised p-6 space-y-4"
        >
          <div class="flex items-center gap-3">
            <span class="mf-icon-tile">
              <UIcon
                name="i-lucide-messages-square"
                aria-hidden="true"
              />
            </span>
            <p class="font-sans font-bold text-base text-mf-ink">
              Works wherever you mod
            </p>
          </div>
          <ul class="mf-pills">
            <li
              v-for="platform in platforms"
              :key="platform"
              class="mf-pill"
            >
              {{ platform }}
            </li>
          </ul>
          <p class="font-serif text-base/[26px] text-mf-ink">
            Good moderation travels. Where a platform's settings matter, the guide tells you.
          </p>
        </aside>
      </section>

      <section
        aria-labelledby="start-here"
        class="py-8 md:py-12"
      >
        <h2
          id="start-here"
          class="mf-h2 mb-6"
        >
          Where do you want to start?
        </h2>
        <div class="mf-grid">
          <article
            v-for="entry in entryPoints"
            :key="entry.to"
            class="mf-card"
          >
            <span class="mf-icon-tile">
              <UIcon
                :name="entry.icon"
                aria-hidden="true"
              />
            </span>
            <h3 class="mf-card__title">
              <NuxtLink :to="entry.to">
                {{ entry.title }}
              </NuxtLink>
            </h3>
            <p class="mf-card__desc">
              {{ entry.description }}
            </p>
            <span
              class="mt-auto inline-flex items-center gap-2 font-sans font-bold text-base text-mf-accent"
              aria-hidden="true"
            >
              {{ entry.link }}
              <UIcon
                name="i-lucide-arrow-right"
                class="size-5"
              />
            </span>
          </article>
        </div>
      </section>

      <section
        v-if="guides?.length"
        aria-labelledby="latest-guides"
        class="py-8 md:py-12"
      >
        <div class="flex flex-wrap items-end justify-between gap-x-6 mb-6">
          <h2
            id="latest-guides"
            class="mf-h2"
          >
            Fresh guides
          </h2>
          <NuxtLink
            to="/guides"
            class="mf-link--onward"
          >
            Browse all guides
            <UIcon
              name="i-lucide-arrow-right"
              class="size-5"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>
        <div class="mf-grid">
          <ResourceCard
            v-for="guide in guides"
            :key="guide.path"
            :to="guide.path"
            :title="guide.title"
            :description="guide.description"
            format="guide"
            :tags="[...(guide.platforms ?? []).map(platformLabel), difficultyLabels[guide.difficulty]]"
          />
        </div>
      </section>

      <section
        v-if="templates?.length"
        aria-labelledby="latest-templates"
        class="py-8 md:py-12"
      >
        <div class="flex flex-wrap items-end justify-between gap-x-6 mb-6">
          <h2
            id="latest-templates"
            class="mf-h2"
          >
            Ready to copy
          </h2>
          <NuxtLink
            to="/templates"
            class="mf-link--onward"
          >
            Browse all templates
            <UIcon
              name="i-lucide-arrow-right"
              class="size-5"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>
        <div class="mf-grid">
          <ResourceCard
            v-for="template in templates"
            :key="template.path"
            :to="template.path"
            :title="template.title"
            :description="template.description"
            format="template"
            :tags="[humanise(template.templateType), ...(template.platforms ?? []).map(platformLabel)]"
          />
        </div>
      </section>

      <section
        v-if="articles?.length"
        aria-labelledby="latest-articles"
        class="py-8 md:py-12"
      >
        <div class="flex flex-wrap items-end justify-between gap-x-6 mb-6">
          <h2
            id="latest-articles"
            class="mf-h2"
          >
            Worth a read
          </h2>
          <NuxtLink
            to="/articles"
            class="mf-link--onward"
          >
            Browse all articles
            <UIcon
              name="i-lucide-arrow-right"
              class="size-5"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>
        <div class="mf-grid">
          <ResourceCard
            v-for="article in articles"
            :key="article.path"
            :to="article.path"
            :title="article.title"
            :description="article.description"
            format="article"
            :meta="formatDate(article.date)"
          />
        </div>
      </section>

      <section
        aria-labelledby="principles"
        class="py-8 md:py-16"
      >
        <h2
          id="principles"
          class="mf-h2 mb-2"
        >
          Built by mods, for mods
        </h2>
        <p class="font-serif text-lg/[29px] text-mf-ink max-w-measure mb-8">
          Moderation is mostly unpaid, often thankless and usually done at odd hours. Here's what we promise in return.
        </p>
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="principle in principles"
            :key="principle.title"
            class="space-y-3"
          >
            <span class="mf-icon-tile">
              <UIcon
                :name="principle.icon"
                aria-hidden="true"
              />
            </span>
            <h3 class="font-serif font-semibold text-[21px]/7 text-mf-ink">
              {{ principle.title }}
            </h3>
            <p class="font-serif text-base/[26px] text-mf-ink">
              {{ principle.description }}
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="contribute"
        class="my-8 rounded-[20px] bg-mf-accent-soft px-6 py-10 md:px-12 md:py-14 grid gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-center"
      >
        <span
          class="hidden md:grid mf-monogram-lg"
          aria-hidden="true"
        >m.</span>
        <div class="space-y-4 max-w-measure-wide">
          <h2
            id="contribute"
            class="mf-h2"
          >
            Learnt something the hard way?
          </h2>
          <p class="font-serif text-lg/[29px] text-mf-ink">
            Write it up and save the next mod the trouble. Guides, templates, fixes and typos are all welcome, and every contributor gets credited.
          </p>
          <div class="flex flex-wrap gap-3">
            <UButton
              to="/contribute"
              label="Read the contributor guide"
              icon="i-lucide-pencil"
            />
            <UButton
              :to="site.repository"
              target="_blank"
              label="Open the repository"
              icon="i-lucide-external-link"
              color="neutral"
              variant="outline"
            />
          </div>
        </div>
      </section>

      <section
        id="newsletter"
        aria-labelledby="updates"
        class="py-12 md:py-16"
      >
        <div class="max-w-measure-wide space-y-4">
          <h2
            id="updates"
            class="mf-h2 flex items-center gap-3"
          >
            <span class="mf-icon-tile">
              <UIcon
                name="i-lucide-mail"
                aria-hidden="true"
              />
            </span>
            Get new guides by email
          </h2>
          <p class="font-serif text-lg/[29px] text-mf-ink">
            An occasional email when something new goes up. No spam, no tracking, unsubscribe whenever you like.
          </p>
          <NewsletterForm />
          <p class="font-sans text-sm text-mf-ink-muted">
            We only use your email to send you updates. Read the <NuxtLink
              to="/privacy"
              class="mf-link"
            >privacy policy</NuxtLink>, or <NuxtLink
              to="/unsubscribe"
              class="mf-link"
            >unsubscribe</NuxtLink>.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
