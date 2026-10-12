<script setup lang="ts">
const props = defineProps<{
  to: string
  title: string
  description?: string
  icon?: string
  category?: string
  type?: string
  difficulty?: keyof typeof difficultyColours
  estimatedTime?: string
  platforms?: string[]
}>()
</script>

<template>
  <UPageCard
    :to="props.to"
    :title="props.title"
    :description="props.description"
    :icon="props.icon ?? 'i-lucide-book-open'"
    spotlight
    :ui="{ description: 'line-clamp-3' }"
  >
    <template #footer>
      <div class="flex flex-wrap items-center gap-2">
        <UBadge
          v-if="category"
          :label="humanise(category)"
          color="neutral"
          variant="subtle"
        />
        <UBadge
          v-if="type"
          :label="humanise(type)"
          color="secondary"
          variant="subtle"
        />
        <UBadge
          v-if="difficulty"
          :label="humanise(difficulty)"
          :color="difficultyColours[difficulty]"
          variant="subtle"
        />
        <span
          v-if="estimatedTime"
          class="inline-flex items-center gap-1 text-xs text-muted"
        >
          <UIcon name="i-lucide-clock" />
          {{ estimatedTime }}
        </span>
        <UIcon
          v-for="platform in platforms?.filter(p => platformIcons[p])"
          :key="platform"
          :name="platformIcons[platform]!"
          :aria-label="humanise(platform)"
          class="size-4 text-muted"
        />
      </div>
    </template>
  </UPageCard>
</template>
