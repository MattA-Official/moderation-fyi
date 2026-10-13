<script setup lang="ts">
defineProps<{
  options: { key: string, label: string, items: { label: string, value: string }[] }[]
  active: boolean
  count: number
  noun: string
}>()

const emit = defineEmits<{ reset: [] }>()

const search = defineModel<string>('search', { required: true })
const filters = defineModel<Record<string, string | null | undefined>>('filters', { required: true })

function toggle(key: string, value: string) {
  filters.value = { ...filters.value, [key]: filters.value[key] === value ? undefined : value }
}
</script>

<template>
  <div class="space-y-4">
    <div class="mf-search max-w-measure">
      <UIcon
        name="i-lucide-search"
        class="mf-search__icon"
        aria-hidden="true"
      />
      <input
        v-model="search"
        type="search"
        class="mf-search__input"
        :placeholder="`Search ${noun}s`"
        :aria-label="`Search ${noun}s`"
      >
    </div>

    <div
      v-for="option in options"
      :key="option.key"
      role="group"
      :aria-label="`Filter by ${option.label.toLowerCase()}`"
      class="flex flex-wrap items-center gap-2"
    >
      <span class="font-sans font-bold text-sm text-mf-ink me-1">{{ option.label }}</span>
      <button
        v-for="item in option.items"
        :key="item.value"
        type="button"
        class="mf-pill mf-pill--filter"
        :aria-pressed="filters[option.key] === item.value"
        @click="toggle(option.key, item.value)"
      >
        <UIcon
          v-if="filters[option.key] === item.value"
          name="i-lucide-check"
          class="size-4"
          aria-hidden="true"
        />
        {{ item.label }}
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-4 font-sans text-sm text-mf-ink-muted">
      <span aria-live="polite">{{ count }} {{ noun }}{{ count === 1 ? '' : 's' }}</span>
      <button
        v-if="active"
        type="button"
        class="mf-link inline-flex items-center min-h-11 font-bold"
        @click="emit('reset')"
      >
        Clear filters
      </button>
    </div>
  </div>
</template>
