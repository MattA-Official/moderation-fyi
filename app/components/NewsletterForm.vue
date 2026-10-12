<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

defineProps<{
  /** Single-field layout for the footer */
  compact?: boolean
}>()

const schema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.email('Please enter a valid email address'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({ name: undefined, email: undefined })
const loading = ref(false)
const subscribed = ref(false)
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await $fetch('/api/subscribe', { method: 'POST', body: event.data })
    subscribed.value = true
    toast.add({ title: 'Thanks for subscribing!', description: 'We\'ll let you know when new resources are published.', color: 'success', icon: 'i-lucide-mail-check' })
  }
  catch (error) {
    const message = (error as { data?: { message?: string } }).data?.message
    toast.add({ title: 'Something went wrong', description: message || 'Please try again in a moment.', color: 'error', icon: 'i-lucide-circle-alert' })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    v-if="subscribed"
    class="flex items-center gap-2 text-sm text-success"
    role="status"
  >
    <UIcon
      name="i-lucide-mail-check"
      class="size-5"
    />
    You're subscribed. Thank you!
  </div>

  <UForm
    v-else-if="compact"
    :schema="schema"
    :state="state"
    @submit="onSubmit"
  >
    <UFormField
      name="email"
      label="Get new resources by email"
      size="lg"
    >
      <UInput
        v-model="state.email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        class="w-full"
        :ui="{ trailing: 'pe-1' }"
      >
        <template #trailing>
          <UButton
            type="submit"
            size="xs"
            color="neutral"
            label="Subscribe"
            :loading="loading"
          />
        </template>
      </UInput>
    </UFormField>
  </UForm>

  <UForm
    v-else
    :schema="schema"
    :state="state"
    class="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-start w-full"
    @submit="onSubmit"
  >
    <UFormField
      name="name"
      label="Name (optional)"
    >
      <UInput
        v-model="state.name"
        autocomplete="given-name"
        placeholder="Alex"
        size="lg"
        class="w-full"
      />
    </UFormField>
    <UFormField
      name="email"
      label="Email"
      required
    >
      <UInput
        v-model="state.email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        size="lg"
        class="w-full"
      />
    </UFormField>
    <UButton
      type="submit"
      label="Subscribe"
      icon="i-lucide-send"
      size="lg"
      :loading="loading"
      class="sm:mt-6 justify-center"
    />
  </UForm>
</template>
