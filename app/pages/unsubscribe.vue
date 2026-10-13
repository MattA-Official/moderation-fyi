<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const route = useRoute()

const schema = z.object({
  email: z.email('Enter an email address, like you@example.com'),
})

type Schema = z.output<typeof schema>

// Links in emails can pre-fill the address with ?email=. Removal still needs a
// click, so email link scanners can't unsubscribe people by visiting the link.
const state = reactive<Partial<Schema>>({
  email: typeof route.query.email === 'string' ? route.query.email : undefined,
})
const loading = ref(false)
const unsubscribed = ref(false)
const failure = ref('')

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  failure.value = ''
  try {
    await $fetch('/api/unsubscribe', { method: 'POST', body: event.data })
    unsubscribed.value = true
  }
  catch (error) {
    failure.value = (error as { data?: { message?: string } }).data?.message || 'That didn\'t work. Try again in a moment.'
  }
  finally {
    loading.value = false
  }
}

useSeoMeta({
  title: 'Unsubscribe',
  description: 'Stop getting moderation.fyi updates by email.',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="mx-auto max-w-page px-4 md:px-8 py-16 md:py-24">
    <div class="max-w-measure space-y-6">
      <template v-if="unsubscribed">
        <h1 class="mf-h1">
          You've been unsubscribed.
        </h1>
        <p
          class="mf-lede"
          role="status"
        >
          You won't get any more emails from us. Changed your mind? You can <NuxtLink
            to="/#newsletter"
            class="mf-link"
          >sign up again</NuxtLink> at any time.
        </p>
      </template>

      <template v-else>
        <h1 class="mf-h1">
          Unsubscribe
        </h1>
        <p class="mf-lede">
          Stop getting moderation.fyi updates by email. Your address is deleted straight away.
        </p>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
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
            label="Unsubscribe me"
            :loading="loading"
          />
          <p
            v-if="failure"
            class="font-sans text-sm text-mf-ink"
            role="alert"
          >
            {{ failure }}
          </p>
        </UForm>
      </template>
    </div>
  </div>
</template>
