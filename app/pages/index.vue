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

const entryPoints = [
  {
    title: 'Guides',
    description: 'Step-by-step answers to the situations mods actually face: writing rules, handling a raid, calming a heated thread.',
    to: '/guides',
    link: 'Browse the guides',
  },
  {
    title: 'Templates',
    description: 'Rules, removal reasons, ban messages and appeal forms you can copy, paste and adapt in a few minutes.',
    to: '/templates',
    link: 'Browse the templates',
  },
  {
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
      <section class="pt-12 md:pt-24 pb-12 md:pb-16 max-w-measure-wide space-y-6">
        <h1 class="mf-display text-pretty">
          Moderation, written by people who've done it.
        </h1>
        <p class="mf-lede">
          Practical guides and templates for volunteer mods on Discord, Reddit, Twitch and everywhere else. Free, open source and written by the community.
        </p>
        <SearchForm large />
      </section>

      <section
        aria-labelledby="start-here"
        class="py-8 md:py-16 border-t border-mf-rule"
      >
        <h2
          id="start-here"
          class="mf-h2 mb-6"
        >
          Start here
        </h2>
        <div class="mf-grid">
          <div
            v-for="entry in entryPoints"
            :key="entry.to"
            class="space-y-2"
          >
            <h3 class="font-serif font-semibold text-[21px]/7 text-mf-ink">
              {{ entry.title }}
            </h3>
            <p class="font-serif text-base/[26px] text-mf-ink">
              {{ entry.description }}
            </p>
            <NuxtLink
              :to="entry.to"
              class="mf-link--onward"
            >
              {{ entry.link }}
              <UIcon
                name="i-lucide-arrow-right"
                class="size-5"
                aria-hidden="true"
              />
            </NuxtLink>
          </div>
        </div>
      </section>

      <section
        v-if="guides?.length"
        aria-labelledby="latest-guides"
        class="py-8 md:py-16 border-t border-mf-rule"
      >
        <h2
          id="latest-guides"
          class="mf-h2 mb-6"
        >
          Latest guides
        </h2>
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
        <NuxtLink
          to="/guides"
          class="mf-link--onward mt-4"
        >
          Browse all guides
          <UIcon
            name="i-lucide-arrow-right"
            class="size-5"
            aria-hidden="true"
          />
        </NuxtLink>
      </section>

      <section
        v-if="templates?.length"
        aria-labelledby="latest-templates"
        class="py-8 md:py-16 border-t border-mf-rule"
      >
        <h2
          id="latest-templates"
          class="mf-h2 mb-6"
        >
          Latest templates
        </h2>
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
        <NuxtLink
          to="/templates"
          class="mf-link--onward mt-4"
        >
          Browse all templates
          <UIcon
            name="i-lucide-arrow-right"
            class="size-5"
            aria-hidden="true"
          />
        </NuxtLink>
      </section>

      <section
        v-if="articles?.length"
        aria-labelledby="latest-articles"
        class="py-8 md:py-16 border-t border-mf-rule"
      >
        <h2
          id="latest-articles"
          class="mf-h2 mb-6"
        >
          Latest articles
        </h2>
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
        <NuxtLink
          to="/articles"
          class="mf-link--onward mt-4"
        >
          Browse all articles
          <UIcon
            name="i-lucide-arrow-right"
            class="size-5"
            aria-hidden="true"
          />
        </NuxtLink>
      </section>
    </div>

    <section
      aria-labelledby="contribute"
      class="bg-mf-paper-sunken border-y border-mf-rule py-12 md:py-16 mt-8"
    >
      <div class="mx-auto max-w-page px-4 md:px-8">
        <div class="max-w-measure-wide space-y-4">
          <h2
            id="contribute"
            class="mf-h2"
          >
            Share what you've learnt
          </h2>
          <p class="font-serif text-lg/[29px] text-mf-ink">
            Everything here is written by volunteer mods. If you've worked out how to handle something the hard way, write it up and save the next mod the trouble.
          </p>
          <div class="flex flex-wrap gap-3">
            <UButton
              to="/contribute"
              label="Read the contributor guide"
            />
            <UButton
              :to="site.repository"
              target="_blank"
              label="Open the repository"
              color="neutral"
              variant="outline"
            />
          </div>
        </div>
      </div>
    </section>

    <section
      id="newsletter"
      aria-labelledby="updates"
      class="mx-auto max-w-page px-4 md:px-8 py-12 md:py-16"
    >
      <div class="max-w-measure-wide space-y-4">
        <h2
          id="updates"
          class="mf-h2"
        >
          Get new guides by email
        </h2>
        <p class="font-serif text-lg/[29px] text-mf-ink">
          An occasional email when something new goes up. Nothing else.
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
</template>
