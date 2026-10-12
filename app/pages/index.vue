<script setup lang="ts">
const { site } = useAppConfig()
const { resolveAuthors } = await useAuthors()

const { data: guides } = await useAsyncData('home-guides', () => queryCollection('guides')
  .select('title', 'description', 'path', 'category', 'difficulty', 'estimatedTime', 'featured', 'publishedAt')
  .order('featured', 'DESC')
  .order('publishedAt', 'DESC')
  .limit(3)
  .all())

const { data: templates } = await useAsyncData('home-templates', () => queryCollection('templates')
  .select('title', 'description', 'path', 'category', 'templateType', 'featured', 'publishedAt')
  .order('featured', 'DESC')
  .order('publishedAt', 'DESC')
  .limit(3)
  .all())

const { data: articles } = await useAsyncData('home-articles', () => queryCollection('articles')
  .select('title', 'description', 'path', 'date', 'image', 'badge', 'authors')
  .order('date', 'DESC')
  .limit(3)
  .all())

const resources = [
  {
    title: 'Guides',
    description: 'Step-by-step walkthroughs for the situations you actually face: writing rules, handling raids, de-escalating conflict and building a mod team.',
    icon: 'i-lucide-book-open',
    to: '/guides',
  },
  {
    title: 'Templates',
    description: 'Copy-and-paste rules, removal reasons, ban appeal forms, onboarding checklists and policies that you can adapt in minutes.',
    icon: 'i-lucide-files',
    to: '/templates',
  },
  {
    title: 'Articles',
    description: 'Case studies, opinion pieces and deeper dives into trends in online safety and community management.',
    icon: 'i-lucide-newspaper',
    to: '/articles',
  },
]

const principles = [
  { title: 'Practical first', description: 'Every resource is written to be used today, not just read.', icon: 'i-lucide-hammer' },
  { title: 'Platform-agnostic', description: 'Discord, Reddit, Twitch, forums and beyond. The principles carry over.', icon: 'i-lucide-layers' },
  { title: 'Community-driven', description: 'Written and reviewed by volunteer moderators with real experience.', icon: 'i-lucide-users' },
  { title: 'Free and open source', description: 'No paywalls, no sign-ups. Everything lives openly on GitHub.', icon: 'i-lucide-heart-handshake' },
  { title: 'Kind and fair', description: 'Approaches that treat everyone with respect, including the people being moderated.', icon: 'i-lucide-scale' },
  { title: 'Always improving', description: 'Every page can be corrected or updated by anyone who spots something better.', icon: 'i-lucide-refresh-cw' },
]

const platforms = ['discord', 'reddit', 'twitch', 'youtube', 'discourse', 'slack', 'telegram', 'mastodon']

useSeoMeta({
  title: 'Practical moderation guides for volunteer moderators',
  description: 'Free, open-source guides and templates to help volunteer moderators on Discord, Reddit, Twitch and beyond run safer, healthier communities.',
})
</script>

<template>
  <div>
    <UPageHero
      orientation="vertical"
      :ui="{ title: 'max-w-4xl mx-auto', description: 'max-w-2xl mx-auto' }"
    >
      <template #headline>
        <UBadge
          label="Open source and free forever"
          variant="subtle"
          icon="i-lucide-sparkles"
          size="lg"
          class="rounded-full"
        />
      </template>

      <template #title>
        Practical guides for <span class="text-gradient">volunteer moderators</span>
      </template>

      <template #description>
        Community-driven resources to help you run safer, healthier and more welcoming online communities, whatever platform you moderate on.
      </template>

      <template #links>
        <UButton
          label="Explore the guides"
          to="/guides"
          icon="i-lucide-book-open"
          size="xl"
        />
        <UButton
          label="Browse templates"
          to="/templates"
          icon="i-lucide-files"
          color="neutral"
          variant="subtle"
          size="xl"
        />
      </template>

      <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-muted">
        <UIcon
          v-for="platform in platforms"
          :key="platform"
          :name="platformIcons[platform]!"
          :aria-label="humanise(platform)"
          class="size-7 opacity-70 hover:opacity-100 transition-opacity"
        />
      </div>
    </UPageHero>

    <UPageSection
      title="Everything a moderator needs, in one place"
      description="Moderation is hard, often thankless work. We collect what experienced moderators have learnt so that you don't have to figure it out alone."
      :ui="{ container: 'pt-0 sm:pt-0 lg:pt-0' }"
    >
      <UPageGrid>
        <UPageCard
          v-for="resource in resources"
          :key="resource.to"
          v-bind="resource"
          spotlight
          spotlight-color="primary"
        >
          <template #footer>
            <span class="text-sm font-medium text-primary inline-flex items-center gap-1">
              Browse {{ resource.title.toLowerCase() }}
              <UIcon name="i-lucide-arrow-right" />
            </span>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <UPageSection
      v-if="guides?.length"
      title="Start with a guide"
      class="bg-muted/50 border-y border-default"
    >
      <template #links>
        <UButton
          label="All guides"
          to="/guides"
          color="neutral"
          variant="link"
          trailing-icon="i-lucide-arrow-right"
        />
      </template>

      <UPageGrid>
        <ResourceCard
          v-for="guide in guides"
          :key="guide.path"
          :to="guide.path"
          :title="guide.title"
          :description="guide.description"
          :category="guide.category"
          :difficulty="guide.difficulty"
          :estimated-time="guide.estimatedTime"
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      v-if="templates?.length"
      title="Ready-made templates"
    >
      <template #links>
        <UButton
          label="All templates"
          to="/templates"
          color="neutral"
          variant="link"
          trailing-icon="i-lucide-arrow-right"
        />
      </template>

      <UPageGrid>
        <ResourceCard
          v-for="template in templates"
          :key="template.path"
          :to="template.path"
          :title="template.title"
          :description="template.description"
          :category="template.category"
          :type="template.templateType"
          icon="i-lucide-file-text"
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      v-if="articles?.length"
      title="Latest articles"
      class="bg-muted/50 border-y border-default"
    >
      <template #links>
        <UButton
          label="All articles"
          to="/articles"
          color="neutral"
          variant="link"
          trailing-icon="i-lucide-arrow-right"
        />
      </template>

      <UBlogPosts>
        <UBlogPost
          v-for="article in articles"
          :key="article.path"
          :to="article.path"
          :title="article.title"
          :description="article.description"
          :image="article.image"
          :date="formatDate(article.date)"
          :authors="resolveAuthors(article.authors)"
          :badge="article.badge ? { ...article.badge, variant: 'subtle' } : undefined"
          variant="naked"
          :ui="{ description: 'line-clamp-2' }"
        />
      </UBlogPosts>
    </UPageSection>

    <UPageSection
      title="Built by moderators, for moderators"
      description="moderation.fyi is a volunteer project. We believe good moderation knowledge should be free, shared openly and improved by the people who use it."
      :features="principles"
    />

    <UPageSection :ui="{ container: 'pt-0 sm:pt-0 lg:pt-0' }">
      <UPageCTA
        title="Share what you've learnt"
        description="Got a technique that works, a template you swear by or a hard-won lesson? Contribute it and help thousands of other moderators."
        variant="subtle"
        :links="[
          { label: 'How to contribute', to: '/contribute', icon: 'i-lucide-git-pull-request', size: 'lg' },
          { label: 'View on GitHub', to: site.repository, target: '_blank', icon: 'i-simple-icons-github', color: 'neutral', variant: 'outline', size: 'lg' },
        ]"
      />
    </UPageSection>

    <UPageSection
      id="newsletter"
      title="Stay in the loop"
      description="Get an occasional email when new guides and templates are published. No spam, unsubscribe at any time."
      :ui="{ container: 'pt-0 sm:pt-0 lg:pt-0 max-w-3xl' }"
    >
      <NewsletterForm />
      <p class="text-xs text-dimmed text-center">
        We only use your email to send you updates. Read our <ULink
          to="/privacy"
          class="underline"
        >privacy policy</ULink>.
      </p>
    </UPageSection>
  </div>
</template>
