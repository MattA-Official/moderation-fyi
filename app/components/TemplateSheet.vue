<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

// A framed sheet that sets copyable template text apart from the page around it
const props = withDefaults(defineProps<{
  title: string
  /** Shown after the title, e.g. the file name */
  detail?: string
  /** What the copy button copies and the Markdown view shows */
  markdown: string
  headingLevel?: 'h2' | 'h3'
}>(), { headingLevel: 'h2' })

const id = useId()
// What gets copied and shown as Markdown, with any filled-in placeholders
const placeholders = inject(templatePlaceholdersKey, undefined)
const filled = computed(() => placeholders?.fillIn(props.markdown) ?? props.markdown)
const view = ref<'preview' | 'markdown'>('preview')
const views = [
  { label: 'Preview', value: 'preview', icon: 'i-lucide-eye' },
  { label: 'Markdown', value: 'markdown', icon: 'i-lucide-code' },
]

// The label itself confirms the copy; no toast or pop-up
const { copy, copied } = useClipboard({ copiedDuring: 2000 })
</script>

<template>
  <section
    :aria-labelledby="id"
    class="mf-template-sheet"
  >
    <header class="mf-template-sheet__bar">
      <div class="flex items-center gap-2 min-w-0">
        <UIcon
          name="i-lucide-file-text"
          class="size-5 shrink-0 text-mf-accent"
          aria-hidden="true"
        />
        <component
          :is="props.headingLevel"
          :id="id"
          class="font-sans font-bold text-base text-mf-ink"
        >
          {{ props.title }}
        </component>
        <span
          v-if="props.detail"
          class="font-mono text-sm text-mf-ink-muted truncate"
        >{{ props.detail }}</span>
      </div>
      <div class="flex items-center gap-2 mf-no-print">
        <UTabs
          v-model="view"
          :items="views"
          :content="false"
          size="sm"
          color="neutral"
          :aria-label="`Show ${props.title} as`"
        />
        <UTooltip :text="copied ? 'Copied' : 'Copy'">
          <UButton
            :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            :aria-label="copied ? 'Copied' : `Copy ${props.title}`"
            color="neutral"
            variant="ghost"
            square
            @click="copy(filled)"
          />
        </UTooltip>
      </div>
    </header>

    <div
      v-show="view === 'preview'"
      class="mf-prose mf-template-sheet__body"
    >
      <slot />
    </div>
    <pre
      v-show="view === 'markdown'"
      class="mf-template-sheet__body mf-template-sheet__source"
    >{{ filled }}</pre>
  </section>
</template>
