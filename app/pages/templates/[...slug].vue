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

// A template either is one piece of text, or holds several snippets with
// guidance around them; then Copy and Download give just the snippets
const snippets = computed(() => templateSnippets(markdown.value))
provide(templateSnippetsKey, snippets)
const copyable = computed(() => snippets.value.size
  ? [...snippets.value].map(([title, body]) => `## ${title}\n\n${body}`).join('\n\n')
  : markdown.value)

// Placeholders like {name} are highlighted in the text and filled in on the
// page; Copy, Download and the Markdown views give the filled-in text
const placeholderValues = ref<Record<string, string>>({})
const fillIn = (text: string) => fillPlaceholders(text, placeholderValues.value)
provide(templatePlaceholdersKey, { values: placeholderValues, fillIn })
const rendered = computed(() => {
  const body = template.value!.body
  if (body?.type !== 'minimark') return template.value!
  return { ...template.value!, body: { ...body, value: markPlaceholders(body.value, snippets.value.size > 0) } }
})

// The label itself confirms the copy; no toast or pop-up
const { copy, copied } = useClipboard({ copiedDuring: 2000 })

const fileName = computed(() => `${template.value!.stem.split('/').pop()}.md`)

function downloadTemplate() {
  const blob = new Blob([fillIn(copyable.value)], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName.value
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
    :toc-title="snippets.size ? undefined : 'In this template'"
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
            :label="copied ? 'Copied' : snippets.size ? 'Copy all snippets' : 'Copy template'"
            :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            @click="copy(fillIn(copyable))"
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
            {{ template.compliance.map(complianceLabel).join(', ') }} in mind
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
      v-if="snippets.size"
      :value="rendered"
      class="mf-prose"
    />
    <TemplateSheet
      v-else
      id="template"
      title="The template"
      :detail="fileName"
      :markdown="markdown"
    >
      <ContentRenderer :value="rendered" />
    </TemplateSheet>

    <PageFooterLinks :file="`${template.stem}.${template.extension}`" />

    <UContentSurround
      :surround="surround ?? []"
      class="mf-no-print"
    />
  </ContentLayout>
</template>
