<script setup lang="ts">
const props = defineProps<{
  /** Content file path relative to `content/`, e.g. `guides/example.md` */
  file?: string
  updatedAt?: string | Date
}>()

const editLink = useEditLink(() => props.file)
const { site } = useAppConfig()
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
    <span v-if="updatedAt">Last updated {{ formatDate(updatedAt, 'long') }}</span>
    <div class="flex flex-wrap gap-2 ms-auto">
      <UButton
        v-if="editLink"
        :to="editLink"
        target="_blank"
        label="Suggest an edit"
        icon="i-lucide-pencil"
        color="neutral"
        variant="ghost"
        size="sm"
      />
      <UButton
        :to="`${site.repository}/issues/new`"
        target="_blank"
        label="Report a problem"
        icon="i-lucide-flag"
        color="neutral"
        variant="ghost"
        size="sm"
      />
    </div>
  </div>
</template>
