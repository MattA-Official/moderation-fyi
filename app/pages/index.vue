<template>
  <main class="page-container">
    <div class="content-card">
      <div class="inner-content">
        <div>
          <span class="badge">Coming Soon</span>
        </div>

        <h1 class="title">
          moderation.fyi
        </h1>

        <p class="tagline">
          Practical moderation guides for volunteer community moderators. Open-source and community-driven.
        </p>

        <div class="description">
          <p>
            Our mission is to build a community-driven knowledge base to help moderators on platforms like Discord,
            Reddit, and Twitch to manage safer and more engaging communities. This project will be fully
            open-source.
          </p>
        </div>

        <div class="github-callout">
          <p>
            Stay tuned for our launch and consider contributing on <NuxtLink
              to="https://github.com/MattA-Official/moderation-fyi"
              target="_blank"
              class="link"
            >GitHub</NuxtLink>.
          </p>
        </div>

        <div class="newsletter-signup">
          <h2 class="signup-title">
            Stay Updated
          </h2>
          <p class="signup-description">
            Sign up to receive updates when we launch
          </p>

          <form
            class="signup-form"
            @submit.prevent="subscribeToNewsletter"
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
                {{ isSubmitting ? 'Signing up...' : 'Sign up' }}
              </button>
            </div>

            <div
              v-if="formMessage"
              class="form-message"
              :class="formMessage.type"
            >
              {{ formMessage.text }}
            </div>

            <div class="privacy-notice">
              <p>
                We respect your privacy. The email address you provide will be used solely for the purpose of sending you our newsletter and updates. We will not share, sell, rent, or trade your email address with any third parties for their promotional purposes. You can <NuxtLink
                  to="/unsubscribe"
                  class="link"
                >unsubscribe</NuxtLink> at any time.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
const email = ref('')
const isSubmitting = ref(false)
const formMessage = ref<{ text: string, type: 'success' | 'error' } | null>(null)

async function subscribeToNewsletter() {
  if (!email.value) return

  isSubmitting.value = true
  formMessage.value = null

  try {
    await $fetch('/api/subscribe', {
      method: 'POST',
      body: { email: email.value },
    })

    // Success
    formMessage.value = {
      text: 'Thanks for signing up! We\'ll keep you updated.',
      type: 'success',
    }
    email.value = ''
  }
  catch (error: unknown) {
    // Handle error
    formMessage.value = {
      text: (error as { data?: { message?: string } }).data?.message || 'Something went wrong. Please try again later.',
      type: 'error',
    }
  }
  finally {
    isSubmitting.value = false
  }
}
</script>
