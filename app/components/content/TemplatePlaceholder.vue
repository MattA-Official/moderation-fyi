<script setup lang="ts">
// A {placeholder} in a template: highlighted, and clicked to fill in. The
// value is shared by every copy of the same placeholder on the page.
const props = defineProps<{
  name: string
}>()

const placeholders = inject(templatePlaceholdersKey, undefined)
const open = ref(false)
const value = computed({
  get: () => placeholders?.values.value[props.name] ?? '',
  set: (next: string) => {
    if (placeholders) placeholders.values.value = { ...placeholders.values.value, [props.name]: next }
  },
})
const filled = computed(() => !!value.value.trim())
// As written in the template, for anywhere outside a template page
const written = `{${props.name}}`
</script>

<template>
  <span v-if="!placeholders">{{ written }}</span>
  <UPopover
    v-else
    v-model:open="open"
    :content="{ align: 'start', side: 'bottom', sideOffset: 6 }"
  >
    <button
      type="button"
      class="mf-placeholder"
      :class="filled && 'mf-placeholder--filled'"
      :aria-label="filled ? `${props.name}: ${value}. Edit` : `Fill in ${props.name}`"
    >
      {{ filled ? value : props.name }}
    </button>

    <template #content>
      <form
        class="p-3 w-72 max-w-[calc(100vw-2rem)]"
        @submit.prevent="open = false"
      >
        <UFormField :label="props.name">
          <UInput
            v-model="value"
            autofocus
            class="w-full"
            :placeholder="`Your ${props.name}`"
          />
        </UFormField>
      </form>
    </template>
  </UPopover>
</template>
