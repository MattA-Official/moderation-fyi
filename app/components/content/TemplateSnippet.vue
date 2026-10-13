<script setup lang="ts">
// One copyable part of a template, for templates that hold several,
// e.g. a warning, a mute notice and a ban message
const props = defineProps<{
  title: string
}>()

const snippets = inject(templateSnippetsKey, undefined)
const markdown = computed(() => snippets?.value.get(props.title) ?? '')
</script>

<template>
  <TemplateSheet
    :title="props.title"
    :markdown="markdown"
    heading-level="h3"
    class="not-first:mt-8 mb-8"
  >
    <slot />
  </TemplateSheet>
</template>
