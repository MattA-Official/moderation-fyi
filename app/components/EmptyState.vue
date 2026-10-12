<script setup lang="ts">
defineProps<{
  noun: string
  filtered?: boolean
}>()

const emit = defineEmits<{ reset: [] }>()
</script>

<template>
  <UEmpty
    v-if="filtered"
    icon="i-lucide-search-x"
    :title="`No ${noun} match your filters`"
    description="Try a different search term or clear the filters."
    :actions="[{ label: 'Clear filters', icon: 'i-lucide-filter-x', color: 'neutral', variant: 'subtle', onClick: () => emit('reset') }]"
    variant="naked"
    size="lg"
  />
  <UEmpty
    v-else
    icon="i-lucide-pencil-line"
    :title="`No ${noun} yet`"
    :description="`We're busy writing the first ${noun}. Want to help? Contributions are very welcome.`"
    :actions="[{ label: 'Contribute', to: '/contribute', icon: 'i-lucide-git-pull-request' }]"
    variant="naked"
    size="lg"
  />
</template>
