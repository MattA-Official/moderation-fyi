<script setup lang="ts">
// A {placeholder} in a template: highlighted, and typed into where it sits.
// The value is shared by every copy of the same placeholder on the page.
const props = defineProps<{
  name: string
}>()

const placeholders = inject(templatePlaceholdersKey, undefined)
const el = useTemplateRef<HTMLElement>('el')
const value = computed(() => placeholders?.values.value[props.name] ?? '')
const filled = computed(() => !!value.value.trim())
// As written in the template, for anywhere outside a template page
const written = `{${props.name}}`

// The text is set by hand rather than bound, so typing never moves the caret.
// It follows the value when that changes elsewhere: the same placeholder in
// another snippet, or the Fill in the blanks box.
function show(text: string) {
  if (el.value && document.activeElement !== el.value && el.value.textContent !== text) el.value.textContent = text
}
onMounted(() => show(value.value))
watch(value, show)

function update() {
  const text = (el.value?.textContent ?? '').replace(/\s*\n\s*/g, ' ')
  placeholders!.values.value = { ...placeholders!.values.value, [props.name]: text }
}

function finish() {
  // Tidy up once they're done, so an emptied field shows its name again
  if (el.value) el.value.textContent = value.value.trim()
}
</script>

<template>
  <span v-if="!placeholders">{{ written }}</span>
  <span
    v-else
    ref="el"
    class="mf-placeholder"
    :class="filled && 'mf-placeholder--filled'"
    :data-name="props.name"
    contenteditable="plaintext-only"
    role="textbox"
    :aria-label="props.name"
    spellcheck="true"
    @input="update"
    @blur="finish"
    @keydown.enter.prevent="el?.blur()"
    @keydown.esc="el?.blur()"
  />
</template>
