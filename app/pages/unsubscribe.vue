<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const route = useRoute()
const toast = useToast()

const schema = z.object({
  email: z.email('Please enter a valid email address'),
})

type Schema = z.output<typeof schema>

// Links in emails can pre-fill the address with ?email=. Removal still needs a
// click, so email link scanners can't unsubscribe people by visiting the link.
const state = reactive<Partial<Schema>>({
  email: typeof route.query.email === 'string' ? route.query.email : undefined,
})
const loading = ref(false)
const unsubscribed = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await $fetch('/api/unsubscribe', { method: 'POST', body: event.data })
    unsubscribed.value = true
  }
  catch (error) {
    const message = (error as { data?: { message?: string } }).data?.message
    toast.add({ title: 'Something went wrong', description: message || 'Please try again in a moment.', color: 'error', icon: 'i-lucide-circle-alert' })
  }
  finally {
    loading.value = false
  }
}

useSeoMeta({
  title: 'Unsubscribe',
  description: 'Unsubscribe from moderation.fyi email updates.',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <UContainer class="py-16 sm:py-24">
    <UPageCard
      class="max-w-xl mx-auto"
      variant="subtle"
    >
      <div
        v-if="unsubscribed"
        class="text-center space-y-4"
        role="status"
      >
        <UIcon
          name="i-lucide-mail-x"
          class="size-10 text-primary mx-auto"
        />
        <h1 class="text-2xl font-bold text-highlighted">
          You've been unsubscribed
        </h1>
        <p class="text-muted">
          You won't receive any more emails from us. Changed your mind? You can sign up again at any time.
        </p>
        <UButton
          to="/#newsletter"
          label="Back to moderation.fyi"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="subtle"
        />
      </div>

      <div
        v-else
        class="space-y-6"
      >
        <div class="text-center space-y-2">
          <h1 class="text-2xl font-bold text-highlighted">
            Unsubscribe
          </h1>
          <p class="text-muted">
            Stop receiving moderation.fyi updates by email.
          </p>
        </div>

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
              placeholder="you@example.com"
              size="lg"
              class="w-full"
            />
          </UFormField>
          <UButton
            type="submit"
            label="Unsubscribe"
            icon="i-lucide-mail-x"
            size="lg"
            block
            :loading="loading"
          />
        </UForm>
      </div>
    </UPageCard>
  </UContainer>
</template>
