<script setup lang="ts">
const props = withDefaults(defineProps<{
  kind?: 'info' | 'warning' | 'stale'
  label: string
}>(), { kind: 'info' })

const icons = {
  info: 'i-lucide-info',
  warning: 'i-lucide-triangle-alert',
  stale: 'i-lucide-history',
}
</script>

<template>
  <aside
    class="mf-callout"
    :class="props.kind !== 'info' && `mf-callout--${props.kind}`"
    :aria-label="props.label"
  >
    <p class="mf-callout__label">
      <UIcon
        :name="icons[props.kind]"
        class="size-5"
        aria-hidden="true"
      />
      {{ props.label }}
    </p>
    <slot />
  </aside>
</template>
