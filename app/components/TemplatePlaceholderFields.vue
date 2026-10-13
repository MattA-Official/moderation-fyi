<script setup lang="ts">
// Every placeholder in a template as a form, so they can all be filled in
// one place as well as by clicking them in the text
const props = defineProps<{
  names: string[]
}>()

const placeholders = inject(templatePlaceholdersKey)!
const anyFilled = computed(() => Object.values(placeholders.values.value).some(value => value.trim()))

function update(name: string, value: string) {
  placeholders.values.value = { ...placeholders.values.value, [name]: value }
}
</script>

<template>
  <section
    aria-labelledby="placeholder-fields"
    class="space-y-3 font-sans text-sm border border-mf-rule rounded-[14px] p-4 mf-no-print"
  >
    <h2
      id="placeholder-fields"
      class="font-sans font-bold text-sm text-mf-ink"
    >
      Fill in the blanks
    </h2>
    <p class="text-mf-ink-muted">
      Whatever you type goes into the text you copy and download.
    </p>
    <UFormField
      v-for="name in props.names"
      :key="name"
      :label="placeholderParts(name).tag ? `${placeholderParts(name).label} (${placeholderParts(name).tag})` : name"
      :ui="{ label: 'text-sm' }"
    >
      <UInput
        :model-value="placeholders.values.value[name] ?? ''"
        class="w-full"
        @update:model-value="update(name, String($event))"
      />
    </UFormField>
    <UButton
      v-if="anyFilled"
      label="Clear all"
      icon="i-lucide-eraser"
      color="neutral"
      variant="ghost"
      @click="placeholders.values.value = {}"
    />
  </section>
</template>
