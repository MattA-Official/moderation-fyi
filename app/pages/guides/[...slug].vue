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

const authors = computed(() => resolveAuthors(guide.value?.authors))

const resourceIcons = {
  documentation: 'i-lucide-book-text',
  tool: 'i-lucide-wrench',
  article: 'i-lucide-newspaper',
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
  <UContainer v-if="guide">
    <UPage>
      <UPageHeader
        :title="guide.title"
        :description="guide.description"
      >
        <template #headline>
          <UBreadcrumb :items="[{ label: 'Guides', to: '/guides', icon: 'i-lucide-book-open' }, { label: humanise(guide.category) }]" />
        </template>

        <div class="flex flex-wrap items-center gap-2 mt-4">
          <UBadge
            :label="humanise(guide.difficulty)"
            :color="difficultyColours[guide.difficulty]"
            variant="subtle"
            icon="i-lucide-gauge"
          />
          <UBadge
            v-if="guide.estimatedTime"
            :label="guide.estimatedTime"
            color="neutral"
            variant="subtle"
            icon="i-lucide-clock"
          />
          <UBadge
            v-for="platform in guide.platforms"
            :key="platform"
            :label="humanise(platform)"
            :icon="platformIcons[platform]"
            color="neutral"
            variant="outline"
          />
          <span class="text-sm text-muted ms-1">Published {{ formatDate(guide.publishedAt, 'long') }}</span>
        </div>

        <AuthorList
          :authors="authors"
          class="mt-6"
        />
      </UPageHeader>

      <UPageBody>
        <UPageCard
          v-if="guide.prerequisites?.length || guide.tools?.length"
          variant="subtle"
          :ui="{ container: 'grid gap-6 sm:grid-cols-2' }"
        >
          <div v-if="guide.prerequisites?.length">
            <p class="font-semibold text-highlighted flex items-center gap-2 mb-2">
              <UIcon
                name="i-lucide-list-checks"
                class="text-primary"
              />
              Before you start
            </p>
            <ul class="list-disc ps-5 text-sm text-muted space-y-1">
              <li
                v-for="item in guide.prerequisites"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>
          </div>
          <div v-if="guide.tools?.length">
            <p class="font-semibold text-highlighted flex items-center gap-2 mb-2">
              <UIcon
                name="i-lucide-wrench"
                class="text-primary"
              />
              What you'll need
            </p>
            <ul class="list-disc ps-5 text-sm text-muted space-y-1">
              <li
                v-for="item in guide.tools"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </UPageCard>

        <ContentRenderer :value="guide" />

        <template v-if="guide.resources?.length">
          <h2 class="text-2xl font-bold text-highlighted">
            Further reading
          </h2>
          <UPageList divide>
            <UPageCard
              v-for="resource in guide.resources"
              :key="resource.url"
              :to="resource.url"
              target="_blank"
              :title="resource.title"
              :description="humanise(resource.type)"
              :icon="resourceIcons[resource.type]"
              variant="ghost"
              orientation="horizontal"
            />
          </UPageList>
        </template>

        <USeparator />

        <PageFooterLinks
          :file="`${guide.stem}.${guide.extension}`"
          :updated-at="guide.updatedAt"
        />

        <UContentSurround :surround="surround ?? []" />
      </UPageBody>

      <template
        v-if="guide.body?.toc?.links?.length"
        #right
      >
        <UContentToc
          :links="guide.body.toc.links"
          title="On this page"
          highlight
        />
      </template>
    </UPage>
  </UContainer>
</template>
