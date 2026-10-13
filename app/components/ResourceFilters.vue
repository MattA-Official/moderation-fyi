<script setup lang="ts">
type Option = {
  key: string
  label: string
  advanced: boolean
  items: { label: string, value: string, count: number }[]
}

type Chip = { label: string, remove: () => void }

const props = withDefaults(defineProps<{
  options: Option[]
  active: boolean
  count: number
  /** Selected filter values plus any dates, shown on the Filters button */
  filterCount: number
  noun: string
  sorts?: { value: string, label: string }[]
  /** Turns on the date range, labelled e.g. "Published" */
  dateLabel?: string
  /** False when the page has its own search box */
  showSearch?: boolean
  /** False when the page shows its own result count */
  showCount?: boolean
}>(), {
  sorts: () => [],
  dateLabel: undefined,
  showSearch: true,
  showCount: true,
})

const emit = defineEmits<{ reset: [] }>()

const search = defineModel<string>('search', { default: '' })
const filters = defineModel<Record<string, string[]>>('filters', { required: true })
const from = defineModel<string>('from', { default: '' })
const to = defineModel<string>('to', { default: '' })
const sort = defineModel<string>('sort', { default: '' })

const panelId = useId()
const open = ref(false)

const pills = computed(() => props.options.filter(option => !option.advanced))
const dropdowns = computed(() => props.options.filter(option => option.advanced))
const hasAdvanced = computed(() => dropdowns.value.length > 0 || Boolean(props.dateLabel) || props.sorts.length > 1)
const advancedActive = computed(() => Boolean(from.value || to.value) || dropdowns.value.some(option => filters.value[option.key]?.length))

function isSelected(key: string, value: string) {
  return filters.value[key]?.includes(value) ?? false
}

function toggle(key: string, value: string) {
  const selected = filters.value[key] ?? []
  filters.value = { ...filters.value, [key]: isSelected(key, value) ? selected.filter(entry => entry !== value) : [...selected, value] }
}

/** A dropdown holds one value at a time */
function pick(key: string, event: Event) {
  const value = (event.target as HTMLSelectElement).value
  filters.value = { ...filters.value, [key]: value ? [value] : [] }
}

// Everything that's narrowing the list, each removable on its own
const chips = computed<Chip[]>(() => [
  ...props.options.flatMap(option => (filters.value[option.key] ?? []).map(value => ({
    label: `${option.label}: ${option.items.find(item => item.value === value)?.label ?? value}`,
    remove: () => toggle(option.key, value),
  }))),
  ...(from.value ? [{ label: `${props.dateLabel ?? 'Date'} from ${formatDate(from.value)}`, remove: () => (from.value = '') }] : []),
  ...(to.value ? [{ label: `${props.dateLabel ?? 'Date'} until ${formatDate(to.value)}`, remove: () => (to.value = '') }] : []),
])
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-3">
      <div
        v-if="showSearch"
        class="mf-search max-w-measure flex-1 min-w-[min(100%,16rem)]"
      >
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

      <button
        v-if="options.length || hasAdvanced"
        type="button"
        class="mf-pill mf-pill--filter"
        :aria-expanded="open"
        :aria-controls="panelId"
        @click="open = !open"
      >
        <UIcon
          name="i-lucide-sliders-horizontal"
          class="size-4"
          aria-hidden="true"
        />
        Filters
        <span
          v-if="filterCount"
          class="mf-count"
        >{{ filterCount }}<span class="sr-only"> active</span></span>
      </button>
    </div>

    <div
      v-show="open"
      :id="panelId"
      class="mf-filter-panel space-y-6"
    >
      <div
        v-for="option in pills"
        :key="option.key"
        role="group"
        :aria-labelledby="`${panelId}-${option.key}`"
      >
        <p
          :id="`${panelId}-${option.key}`"
          class="font-sans font-bold text-sm text-mf-ink mb-2"
        >
          {{ option.label }}
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in option.items"
            :key="item.value"
            type="button"
            class="mf-pill mf-pill--filter"
            :aria-pressed="isSelected(option.key, item.value)"
            :disabled="!item.count && !isSelected(option.key, item.value)"
            @click="toggle(option.key, item.value)"
          >
            <UIcon
              v-if="isSelected(option.key, item.value)"
              name="i-lucide-check"
              class="size-4"
              aria-hidden="true"
            />
            {{ item.label }}
            <span class="mf-pill__count"><span class="sr-only">(</span>{{ item.count }}<span class="sr-only">)</span></span>
          </button>
        </div>
      </div>

      <details
        v-if="hasAdvanced"
        class="mf-advanced"
        :open="advancedActive || undefined"
      >
        <summary class="mf-advanced__summary">
          <UIcon
            name="i-lucide-chevron-right"
            class="mf-advanced__chevron size-4"
            aria-hidden="true"
          />
          Advanced
        </summary>
        <div class="grid gap-4 pt-4 sm:grid-cols-2">
          <label
            v-for="option in dropdowns"
            :key="option.key"
            class="mf-field"
          >
            <span class="mf-field__label">{{ option.label }}</span>
            <select
              class="mf-input"
              :value="filters[option.key]?.[0] ?? ''"
              @change="pick(option.key, $event)"
            >
              <option value="">Any {{ option.label.toLowerCase() }}</option>
              <option
                v-for="item in option.items"
                :key="item.value"
                :value="item.value"
                :disabled="!item.count && !isSelected(option.key, item.value)"
              >{{ item.label }} ({{ item.count }})</option>
            </select>
          </label>

          <template v-if="dateLabel">
            <label class="mf-field">
              <span class="mf-field__label">{{ dateLabel }} from</span>
              <input
                v-model="from"
                type="date"
                class="mf-input"
                :max="to || undefined"
              >
            </label>
            <label class="mf-field">
              <span class="mf-field__label">{{ dateLabel }} until</span>
              <input
                v-model="to"
                type="date"
                class="mf-input"
                :min="from || undefined"
              >
            </label>
          </template>

          <label
            v-if="sorts.length > 1"
            class="mf-field"
          >
            <span class="mf-field__label">Sort by</span>
            <select
              v-model="sort"
              class="mf-input"
            >
              <option
                v-for="option in sorts"
                :key="option.value"
                :value="option.value"
              >{{ option.label }}</option>
            </select>
          </label>
        </div>
      </details>
    </div>

    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-sm text-mf-ink-muted">
      <span
        v-if="showCount"
        aria-live="polite"
      >{{ count }} {{ noun }}{{ count === 1 ? '' : 's' }}</span>
      <ul
        v-if="chips.length"
        class="mf-pills"
        aria-label="Active filters"
      >
        <li
          v-for="chip in chips"
          :key="chip.label"
        >
          <button
            type="button"
            class="mf-pill mf-pill--chip"
            :aria-label="`Remove filter ${chip.label}`"
            @click="chip.remove()"
          >
            {{ chip.label }}
            <UIcon
              name="i-lucide-x"
              class="size-3.5"
              aria-hidden="true"
            />
          </button>
        </li>
      </ul>
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
