<template>
  <div class="mf-page">
    <header class="mf-shell header">
      <NuxtLink
        to="/"
        class="mf-wordmark"
      >moderation<span class="mf-wordmark__tld">.fyi</span></NuxtLink>
    </header>

    <main class="mf-shell main">
      <template v-if="!unsubscribed">
        <h1 class="mf-display">
          Unsubscribe
        </h1>
        <p class="mf-lede">
          Stop getting moderation.fyi emails. Your address is deleted straight away.
        </p>

        <form
          class="mf-card mf-card--raised form"
          @submit.prevent="unsubscribe"
        >
          <label
            for="email"
            class="mf-label"
          >Email</label>
          <div class="mf-field">
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="mf-input"
            >
            <button
              type="submit"
              class="mf-button"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Unsubscribing…' : 'Unsubscribe me' }}
            </button>
          </div>
          <p
            v-if="errorMessage"
            class="mf-error"
            role="alert"
          >
            {{ errorMessage }}
          </p>
        </form>
      </template>

      <template v-else>
        <span class="mf-icon-tile"><MfIcon name="check" /></span>
        <h1 class="mf-display">
          You've been unsubscribed.
        </h1>
        <p
          class="mf-lede"
          role="status"
        >
          No more emails from us. Changed your mind? You can <NuxtLink
            to="/"
            class="mf-link"
          >sign up again</NuxtLink> at any time.
        </p>
      </template>

      <NuxtLink
        to="/"
        class="mf-link mf-link--quiet back"
      >
        <MfIcon name="arrow-left" /> Back to moderation.fyi
      </NuxtLink>
    </main>

    <SiteFooter />
  </div>
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

<style scoped>
.header {
  padding-block: 24px;
}

.main {
  display: grid;
  gap: 24px;
  justify-items: start;
  max-inline-size: 48rem;
  padding-block: 48px 96px;
}

.form {
  display: grid;
  gap: 8px;
  inline-size: 100%;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans);
  font-size: 14px;
}
</style>
