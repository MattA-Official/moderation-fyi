<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.email('Enter an email address, like you@example.com'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({ name: undefined, email: undefined })
const loading = ref(false)
const subscribed = ref(false)
const failure = ref('')

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  failure.value = ''
  try {
    await $fetch('/api/subscribe', { method: 'POST', body: event.data })
    subscribed.value = true
  }
  catch (error) {
    failure.value = (error as { data?: { message?: string } }).data?.message || 'That didn\'t work. Try again in a moment.'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <p
    v-if="subscribed"
    class="flex items-center gap-3 font-serif text-lg/[29px] text-mf-ink"
    role="status"
  >
    <span class="mf-icon-tile">
      <UIcon
        name="i-lucide-check"
        aria-hidden="true"
      />
    </span>
    You're on the list. We'll email you when something new goes up.
  </p>

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
        class="w-full"
      />
    </UFormField>
    <UFormField
      name="email"
      label="Email"
    >
      <UInput
        v-model="state.email"
        type="email"
        autocomplete="email"
        class="w-full"
      />
    </UFormField>
    <UButton
      type="submit"
      label="Get updates"
      color="neutral"
      variant="outline"
      :loading="loading"
      class="sm:mt-7 justify-center"
    />
    <p
      v-if="failure"
      class="sm:col-span-3 font-sans text-sm text-mf-ink"
      role="alert"
    >
      {{ failure }}
    </p>
  </UForm>
</template>
