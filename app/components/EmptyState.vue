<script setup lang="ts">
defineProps<{
  noun: string
  filtered?: boolean
}>()

const emit = defineEmits<{ reset: [] }>()
</script>

<template>
  <div class="py-12 max-w-measure font-serif text-lg/[29px] text-mf-ink">
    <template v-if="filtered">
      <p>
        No {{ noun }} match those filters.
        <button
          type="button"
          class="mf-link font-sans font-bold text-base"
          @click="emit('reset')"
        >
          Clear filters
        </button>
      </p>
    </template>
    <p v-else>
      No {{ noun }} yet. <NuxtLink
        to="/contribute"
        class="mf-link"
      >Want to write the first one?</NuxtLink>
    </p>
  </div>
</template>
