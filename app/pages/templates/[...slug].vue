<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const route = useRoute()
const { resolveAuthors } = await useAuthors()

const { data: template } = await useAsyncData(route.path, () => queryCollection('templates').path(route.path).first())
if (!template.value) {
  throw createError({ statusCode: 404, statusMessage: 'Template not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryCollectionItemSurroundings('templates', route.path, {
  fields: ['description'],
}))

const licence = computed(() => licences[template.value!.license])
const effort = computed(() => {
  const customization = template.value?.customization
  if (!customization) return ''
  const level = humanise(customization.difficulty)
  return customization.estimatedTime ? `${level}, about ${customization.estimatedTime}` : level
})
const tags = computed(() => [
  humanise(template.value!.templateType),
  ...(template.value?.platforms ?? []).map(platformLabel),
])

/** The template body without its YAML front matter */
const markdown = computed(() => (template.value?.rawbody ?? '')
  .replace(/^---[\s\S]*?\n---\s*/, '')
  .replace(/\\n/g, '\n')
  .trim())

// The label itself confirms the copy; no toast or pop-up
const { copy, copied } = useClipboard({ copiedDuring: 2000 })

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
  <ContentLayout
    v-if="template"
    :toc="template.body?.toc?.links"
  >
    <template #header>
      <PageMeta
        format="template"
        :tags="tags"
        :title="template.title"
        :description="template.description"
        :reviewed="template.updatedAt ?? template.publishedAt"
        :authors="resolveAuthors(template.authors)"
        :file="`${template.stem}.${template.extension}`"
        :breadcrumb="{ label: 'All templates', to: '/templates' }"
      >
        <div class="flex flex-wrap gap-3 mf-no-print">
          <UButton
            :label="copied ? 'Copied' : 'Copy template'"
            :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            @click="copy(markdown)"
          />
          <UButton
            v-if="template.downloadable"
            label="Download as Markdown"
            icon="i-lucide-download"
            color="neutral"
            variant="outline"
            @click="downloadTemplate"
          />
        </div>
      </PageMeta>
    </template>

    <template #aside>
      <dl class="space-y-3 font-sans text-sm border border-mf-rule rounded-[14px] p-4">
        <div v-if="template.customization">
          <dt class="text-mf-ink-muted">
            Effort to adapt
          </dt>
          <dd class="text-mf-ink">
            {{ effort }}
          </dd>
        </div>
        <div v-if="template.customization?.requirements?.length">
          <dt class="text-mf-ink-muted">
            You'll need
          </dt>
          <dd class="text-mf-ink">
            {{ template.customization.requirements.join('; ') }}
          </dd>
        </div>
        <div v-if="template.compliance?.length">
          <dt class="text-mf-ink-muted">
            Written with
          </dt>
          <dd class="text-mf-ink">
            {{ template.compliance.join(', ') }} in mind
          </dd>
        </div>
        <div>
          <dt class="text-mf-ink-muted">
            Licence
          </dt>
          <dd>
            <NuxtLink
              :to="licence.to"
              external
              class="mf-link"
            >
              {{ licence.label }}
            </NuxtLink>
          </dd>
        </div>
      </dl>
    </template>

    <ContentRenderer
      :value="template"
      class="mf-prose"
    />

    <PageFooterLinks :file="`${template.stem}.${template.extension}`" />

    <UContentSurround
      :surround="surround ?? []"
      class="mf-no-print"
    />
  </ContentLayout>
</template>
