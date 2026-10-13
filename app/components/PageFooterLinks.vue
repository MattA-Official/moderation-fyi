<script setup lang="ts">
const props = defineProps<{
  /** Content file path relative to `content/`, e.g. `guides/example.md` */
  file?: string
}>()

const editLink = useEditLink(() => props.file)
const { site } = useAppConfig()
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-6 border-t border-mf-rule pt-4">
    <NuxtLink
      v-if="editLink"
      :to="editLink"
      external
      class="mf-edit"
    >
      <UIcon
        name="i-lucide-pencil"
        class="size-4"
        aria-hidden="true"
      />
      Edit this page
    </NuxtLink>
    <NuxtLink
      :to="`${site.repository}/issues/new`"
      external
      class="mf-link mf-link--quiet inline-flex items-center min-h-11 font-sans text-sm"
    >
      Report a problem
    </NuxtLink>
  </div>
</template>
