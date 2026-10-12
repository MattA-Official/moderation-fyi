<template>
  <main class="page-container">
    <div class="content-card">
      <div class="inner-content">
        <h1 class="title">
          Unsubscribe
        </h1>

        <p class="tagline">
          Stop receiving moderation.fyi updates by email.
        </p>

        <div class="newsletter-signup">
          <form
            v-if="!unsubscribed"
            class="signup-form"
            @submit.prevent="unsubscribe"
          >
            <div class="form-group">
              <input
                v-model="email"
                type="email"
                placeholder="Your email address"
                required
                class="email-input"
                aria-label="Email address"
              >
              <button
                type="submit"
                class="submit-button"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Unsubscribing...' : 'Unsubscribe' }}
              </button>
            </div>

            <div
              v-if="errorMessage"
              class="form-message error"
              role="alert"
            >
              {{ errorMessage }}
            </div>
          </form>

          <div
            v-else
            class="form-message success"
            role="status"
          >
            You've been unsubscribed and won't receive any more emails from us. Changed your mind? You can
            <NuxtLink
              to="/"
              class="link"
            >sign up again</NuxtLink> at any time.
          </div>
        </div>

        <div class="github-callout">
          <NuxtLink
            to="/"
            class="link"
          >
            ← Back to moderation.fyi
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
const route = useRoute()

// Links in emails can pre-fill the address with ?email=. Removal still needs a
// click, so email link scanners can't unsubscribe people by visiting the link.
const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const isSubmitting = ref(false)
const unsubscribed = ref(false)
const errorMessage = ref('')

async function unsubscribe() {
  if (!email.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/unsubscribe', {
      method: 'POST',
      body: { email: email.value },
    })
    unsubscribed.value = true
  }
  catch (error: unknown) {
    errorMessage.value = (error as { data?: { message?: string } }).data?.message || 'Something went wrong. Please try again later.'
  }
  finally {
    isSubmitting.value = false
  }
}

useSeoMeta({
  title: 'Unsubscribe',
  description: 'Unsubscribe from moderation.fyi email updates.',
  robots: 'noindex, nofollow',
})
</script>
