<script setup lang="ts">
const route = useRoute()
const { resolveAuthors } = await useAuthors()

const { data: guide } = await useAsyncData(route.path, () => queryCollection('guides').path(route.path).first())
if (!guide.value) {
  throw createError({ statusCode: 404, statusMessage: 'Guide not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryCollectionItemSurroundings('guides', route.path, {
  fields: ['description'],
}))

const tags = computed(() => [
  ...(guide.value?.platforms ?? []).map(platformLabel),
  difficultyLabels[guide.value!.difficulty],
])

const resourceIcons = {
  documentation: 'i-lucide-book-open',
  tool: 'i-lucide-wrench',
  article: 'i-lucide-file-text',
  video: 'i-lucide-video',
} as const

useSeoMeta({
  title: guide.value.seo?.title || guide.value.title,
  description: guide.value.seo?.description || guide.value.description,
  ogType: 'article',
  ogImage: guide.value.image?.src,
  articlePublishedTime: new Date(guide.value.publishedAt).toISOString(),
  articleModifiedTime: guide.value.updatedAt ? new Date(guide.value.updatedAt).toISOString() : undefined,
})

useSchemaOrg([
  defineArticle({
    '@type': 'TechArticle',
    'datePublished': new Date(guide.value.publishedAt).toISOString(),
    'dateModified': guide.value.updatedAt ? new Date(guide.value.updatedAt).toISOString() : undefined,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Guides', item: '/guides' },
      { name: guide.value.title },
    ],
  }),
])
</script>

<template>
  <ContentLayout
    v-if="guide"
    :toc="guide.body?.toc?.links"
  >
    <template #header>
      <PageMeta
        format="guide"
        :tags="tags"
        :title="guide.title"
        :description="guide.description"
        :reading-time="readingTime(guide.body)"
        :reviewed="guide.updatedAt ?? guide.publishedAt"
        :authors="resolveAuthors(guide.authors)"
        :file="`${guide.stem}.${guide.extension}`"
        :breadcrumb="{ label: 'All guides', to: '/guides' }"
      />
    </template>

    <MfCallout
      v-if="guide.prerequisites?.length || guide.tools?.length || guide.estimatedTime"
      label="Before you start"
      class="max-w-measure"
    >
      <p v-if="guide.estimatedTime">
        This takes about {{ guide.estimatedTime }}.
      </p>
      <p v-if="guide.prerequisites?.length">
        You'll need: {{ guide.prerequisites.join('; ') }}.
      </p>
      <p v-if="guide.tools?.length">
        Tools: {{ guide.tools.join('; ') }}.
      </p>
    </MfCallout>

    <ContentRenderer
      :value="guide"
      class="mf-prose"
    />

    <section
      v-if="guide.resources?.length"
      aria-labelledby="sources"
      class="max-w-measure"
    >
      <h2
        id="sources"
        class="mf-h2 mb-3"
      >
        Sources and further reading
      </h2>
      <ul class="space-y-1">
        <li
          v-for="resource in guide.resources"
          :key="resource.url"
          class="flex items-start gap-2 font-serif text-lg/[29px]"
        >
          <UIcon
            :name="resourceIcons[resource.type]"
            class="size-5 mt-1 shrink-0 text-mf-ink-muted"
            aria-hidden="true"
          />
          <span>
            <NuxtLink
              :to="resource.url"
              external
              class="mf-link"
            >{{ resource.title }}</NuxtLink>
            <UIcon
              name="i-lucide-external-link"
              class="size-4 ms-1 align-[-2px] text-mf-ink-muted"
              aria-label="(external)"
            />
          </span>
        </li>
      </ul>
    </section>

    <PageFooterLinks :file="`${guide.stem}.${guide.extension}`" />

    <UContentSurround
      :surround="surround ?? []"
      class="mf-no-print"
    />
  </ContentLayout>
</template>
