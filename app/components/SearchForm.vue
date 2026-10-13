<script setup lang="ts">
const props = defineProps<{
  /** The large hero version, with a visible label */
  large?: boolean
}>()

const route = useRoute()
const id = useId()
const placeholder = useSearchPlaceholder()
const query = ref(typeof route.query.q === 'string' && route.path === '/search' ? route.query.q : '')

watch(() => route.query.q, (value) => {
  if (route.path === '/search') query.value = typeof value === 'string' ? value : ''
})

function submit() {
  navigateTo({ path: '/search', query: query.value.trim() ? { q: query.value.trim() } : {} })
}
</script>

<template>
  <form
    role="search"
    action="/search"
    method="get"
    :class="{ 'w-full': props.large }"
    @submit.prevent="submit"
  >
    <label
      v-if="props.large"
      :for="id"
      class="mf-search__label"
    >Find a resource</label>
    <div
      class="mf-search"
      :class="{ 'mf-search--lg': props.large }"
    >
      <UIcon
        name="i-lucide-search"
        class="mf-search__icon"
        aria-hidden="true"
      />
      <input
        :id="id"
        v-model="query"
        type="search"
        name="q"
        class="mf-search__input"
        :placeholder="placeholder"
        :aria-label="props.large ? undefined : 'Search the library'"
        autocomplete="off"
      >
    </div>
  </form>
</template>
