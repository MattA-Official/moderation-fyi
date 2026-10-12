<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const route = useRoute()
const { resolveAuthors } = await useAuthors()
const toast = useToast()

const { data: template } = await useAsyncData(route.path, () => queryCollection('templates').path(route.path).first())
if (!template.value) {
  throw createError({ statusCode: 404, statusMessage: 'Template not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryCollectionItemSurroundings('templates', route.path, {
  fields: ['description'],
}))

const authors = computed(() => resolveAuthors(template.value?.authors))
const licence = computed(() => licences[template.value!.license])

/** The template body without its YAML front matter */
const markdown = computed(() => (template.value?.rawbody ?? '')
  .replace(/^---[\s\S]*?\n---\s*/, '')
  .replace(/\\n/g, '\n')
  .trim())

const { copy, copied } = useClipboard({ copiedDuring: 2000 })

async function copyTemplate() {
  await copy(markdown.value)
  toast.add({ title: 'Template copied', description: 'Paste it wherever you need it and adapt it to your community.', icon: 'i-lucide-clipboard-check', color: 'success' })
}

function downloadTemplate() {
  const blob = new Blob([markdown.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${template.value!.stem.split('/').pop()}.md`
  link.click()
  URL.revokeObjectURL(url)
}

useSeoMeta({
  title: template.value.seo?.title || template.value.title,
  description: template.value.seo?.description || template.value.description,
  ogImage: template.value.image?.src,
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Templates', item: '/templates' },
      { name: template.value.title },
    ],
  }),
])
</script>

<template>
  <UContainer v-if="template">
    <UPage>
      <UPageHeader
        :title="template.title"
        :description="template.description"
      >
        <template #headline>
          <UBreadcrumb :items="[{ label: 'Templates', to: '/templates', icon: 'i-lucide-files' }, { label: humanise(template.category) }]" />
        </template>

        <template #links>
          <UButton
            :label="copied ? 'Copied' : 'Copy template'"
            :icon="copied ? 'i-lucide-clipboard-check' : 'i-lucide-clipboard'"
            @click="copyTemplate"
          />
          <UButton
            v-if="template.downloadable"
            label="Download .md"
            icon="i-lucide-download"
            color="neutral"
            variant="subtle"
            @click="downloadTemplate"
          />
        </template>

        <div class="flex flex-wrap items-center gap-2 mt-4">
          <UBadge
            :label="humanise(template.templateType)"
            color="secondary"
            variant="subtle"
            icon="i-lucide-file-text"
          />
          <UBadge
            v-for="platform in template.platforms"
            :key="platform"
            :label="humanise(platform)"
            :icon="platformIcons[platform]"
            color="neutral"
            variant="outline"
          />
          <span class="text-sm text-muted ms-1">Published {{ formatDate(template.publishedAt, 'long') }}</span>
        </div>

        <AuthorList
          :authors="authors"
          class="mt-6"
        />
      </UPageHeader>

      <UPageBody>
        <ContentRenderer :value="template" />

        <USeparator />

        <PageFooterLinks
          :file="`${template.stem}.${template.extension}`"
          :updated-at="template.updatedAt"
        />

        <UContentSurround :surround="surround ?? []" />
      </UPageBody>

      <template #right>
        <UPageAside>
          <div class="space-y-6">
            <UPageCard
              title="About this template"
              variant="subtle"
              :ui="{ body: 'w-full', title: 'text-sm' }"
            >
              <dl class="grid gap-3 text-sm">
                <div v-if="template.customization">
                  <dt class="text-muted">
                    Effort to adapt
                  </dt>
                  <dd class="text-highlighted">
                    {{ humanise(template.customization.difficulty) }}<template v-if="template.customization.estimatedTime">
                      · {{ template.customization.estimatedTime }}
                    </template>
                  </dd>
                </div>
                <div v-if="template.compliance?.length">
                  <dt class="text-muted">
                    Compliance
                  </dt>
                  <dd class="flex flex-wrap gap-1 mt-1">
                    <UBadge
                      v-for="item in template.compliance"
                      :key="item"
                      :label="item"
                      color="neutral"
                      variant="subtle"
                      size="sm"
                    />
                  </dd>
                </div>
                <div v-if="template.customization?.requirements?.length">
                  <dt class="text-muted">
                    You'll need
                  </dt>
                  <dd>
                    <ul class="list-disc ps-4 text-highlighted">
                      <li
                        v-for="item in template.customization.requirements"
                        :key="item"
                      >
                        {{ item }}
                      </li>
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt class="text-muted">
                    Licence
                  </dt>
                  <dd>
                    <ULink
                      :to="licence.to"
                      target="_blank"
                      class="text-primary"
                    >
                      {{ licence.label }}
                    </ULink>
                  </dd>
                </div>
              </dl>
            </UPageCard>

            <UContentToc
              v-if="template.body?.toc?.links?.length"
              :links="template.body.toc.links"
              title="On this page"
              highlight
            />
          </div>
        </UPageAside>
      </template>
    </UPage>
  </UContainer>
</template>
