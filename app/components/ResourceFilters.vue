<script setup lang="ts">
import { parseDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

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

// Reka's select can't hold an empty value, so "any" stands in for no filter
const ANY = '__any'

const pills = computed(() => props.options.filter(option => !option.advanced))
const dropdowns = computed(() => props.options.filter(option => option.advanced))
const hasAdvanced = computed(() => dropdowns.value.length > 0 || Boolean(props.dateLabel) || props.sorts.length > 1)
const advancedActive = computed(() => Boolean(from.value || to.value) || dropdowns.value.some(option => filters.value[option.key]?.length))
const advancedOpen = ref(advancedActive.value)

function isSelected(key: string, value: string) {
  return filters.value[key]?.includes(value) ?? false
}

function setValues(key: string, values: unknown[]) {
  filters.value = { ...filters.value, [key]: values.filter((value): value is string => typeof value === 'string') }
}

function pillItems(option: Option) {
  return option.items.map(item => ({ ...item, disabled: !item.count && !isSelected(option.key, item.value) }))
}

/** A dropdown holds one value at a time */
function selectItems(option: Option) {
  return [
    { label: `Any ${option.label.toLowerCase()}`, value: ANY },
    ...option.items.map(item => ({ label: `${item.label} (${item.count})`, value: item.value, disabled: !item.count && !isSelected(option.key, item.value) })),
  ]
}

function pick(key: string, value: unknown) {
  setValues(key, value && value !== ANY ? [value] : [])
}

// The date inputs work in CalendarDates; the URL and filters in YYYY-MM-DD
const range = computed({
  get: () => ({ start: from.value ? parseDate(from.value) : undefined, end: to.value ? parseDate(to.value) : undefined }),
  set: (value: { start?: DateValue | null, end?: DateValue | null } | null) => {
    from.value = value?.start?.toString() ?? ''
    to.value = value?.end?.toString() ?? ''
  },
})
const inputDate = useTemplateRef('inputDate')

// Everything that's narrowing the list, each removable on its own
const chips = computed<Chip[]>(() => [
  ...props.options.flatMap(option => (filters.value[option.key] ?? []).map(value => ({
    label: `${option.label}: ${option.items.find(item => item.value === value)?.label ?? value}`,
    remove: () => setValues(option.key, (filters.value[option.key] ?? []).filter(entry => entry !== value)),
  }))),
  ...(from.value ? [{ label: `${props.dateLabel ?? 'Date'} from ${formatDate(from.value)}`, remove: () => (from.value = '') }] : []),
  ...(to.value ? [{ label: `${props.dateLabel ?? 'Date'} until ${formatDate(to.value)}`, remove: () => (to.value = '') }] : []),
])
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center gap-3">
      <UInput
        v-if="showSearch"
        v-model="search"
        type="search"
        icon="i-lucide-search"
        size="lg"
        :placeholder="`Search ${noun}s`"
        :aria-label="`Search ${noun}s`"
        class="flex-1 min-w-[min(100%,16rem)] max-w-measure"
      />

      <UPopover
        v-if="options.length || hasAdvanced"
        :content="{ align: 'start', sideOffset: 8, collisionPadding: 16 }"
      >
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          icon="i-lucide-sliders-horizontal"
          label="Filters"
        >
          <template
            v-if="filterCount"
            #trailing
          >
            <UBadge
              color="primary"
              variant="solid"
              size="sm"
            >
              {{ filterCount }}<span class="sr-only"> active</span>
            </UBadge>
          </template>
        </UButton>

        <template #content>
          <div class="w-[min(calc(100vw-2rem),26rem)] max-h-[min(70vh,36rem)] overflow-y-auto p-4 space-y-5">
            <UCheckboxGroup
              v-for="option in pills"
              :key="option.key"
              :legend="option.label"
              :items="pillItems(option)"
              :model-value="filters[option.key] ?? []"
              orientation="horizontal"
              :ui="{ fieldset: 'flex-wrap gap-x-5 gap-y-2', legend: 'mb-2 font-sans font-bold text-sm text-mf-ink', label: 'font-sans text-sm text-mf-ink' }"
              @update:model-value="setValues(option.key, $event)"
            >
              <template #label="{ item }">
                {{ item.label }} <span class="text-mf-ink-muted">{{ item.count }}</span>
              </template>
            </UCheckboxGroup>

            <UCollapsible
              v-if="hasAdvanced"
              v-model:open="advancedOpen"
              :class="{ 'border-t border-mf-rule pt-3': pills.length }"
            >
              <UButton
                color="neutral"
                variant="ghost"
                label="Advanced"
                trailing-icon="i-lucide-chevron-down"
                class="group -mx-2.5"
                :ui="{ trailingIcon: 'transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none' }"
              />

              <template #content>
                <div class="space-y-4 pt-3">
                  <UFormField
                    v-for="option in dropdowns"
                    :key="option.key"
                    :label="option.label"
                    :ui="{ label: 'text-sm' }"
                  >
                    <USelect
                      :model-value="filters[option.key]?.[0] ?? ANY"
                      :items="selectItems(option)"
                      class="w-full"
                      @update:model-value="pick(option.key, $event)"
                    />
                  </UFormField>

                  <UFormField
                    v-if="dateLabel"
                    :label="dateLabel"
                    :ui="{ label: 'text-sm' }"
                  >
                    <UInputDate
                      ref="inputDate"
                      v-model="range"
                      range
                      locale="en-GB"
                      class="w-full"
                    >
                      <template #trailing>
                        <UPopover :reference="inputDate?.inputsRef?.[0]?.$el">
                          <UButton
                            color="neutral"
                            variant="link"
                            size="sm"
                            icon="i-lucide-calendar"
                            aria-label="Pick dates from a calendar"
                            class="px-0 min-h-0"
                          />
                          <template #content>
                            <UCalendar
                              v-model="range"
                              range
                              locale="en-GB"
                              class="p-2"
                            />
                          </template>
                        </UPopover>
                      </template>
                    </UInputDate>
                  </UFormField>

                  <UFormField
                    v-if="sorts.length > 1"
                    label="Sort by"
                    :ui="{ label: 'text-sm' }"
                  >
                    <USelect
                      v-model="sort"
                      :items="sorts"
                      class="w-full"
                    />
                  </UFormField>
                </div>
              </template>
            </UCollapsible>
          </div>
        </template>
      </UPopover>
    </div>

    <div
      v-if="showCount || chips.length"
      class="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-sm text-mf-ink-muted"
    >
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
        class="mf-link font-bold"
        @click="emit('reset')"
      >
        Clear filters
      </button>
    </div>
  </div>
</template>
