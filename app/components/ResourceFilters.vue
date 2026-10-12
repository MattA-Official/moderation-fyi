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
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
    <UInput
      v-model="search"
      icon="i-lucide-search"
      placeholder="Search…"
      aria-label="Search"
      class="sm:w-72"
      :ui="{ trailing: 'pe-1' }"
    >
      <template
        v-if="search"
        #trailing
      >
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-x"
          aria-label="Clear search"
          @click="search = ''"
        />
      </template>
    </UInput>

    <USelectMenu
      v-for="option in options"
      :key="option.key"
      v-model="filters[option.key]"
      :items="option.items"
      value-key="value"
      :search-input="false"
      clear
      :placeholder="option.label"
      :aria-label="`Filter by ${option.label.toLowerCase()}`"
      class="sm:w-44"
    />

    <div class="flex items-center gap-3 sm:ms-auto text-sm text-muted">
      <span>{{ count }} {{ noun }}{{ count === 1 ? '' : 's' }}</span>
      <UButton
        v-if="active"
        label="Clear filters"
        color="neutral"
        variant="ghost"
        size="sm"
        icon="i-lucide-filter-x"
        @click="emit('reset')"
      />
    </div>
  </div>
</template>
