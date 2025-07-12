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
                We respect your privacy. The email address you provide will be used solely for the purpose of sending you our newsletter and updates. We will not share, sell, rent, or trade your email address with any third parties for their promotional purposes. You can unsubscribe at any time by clicking the "unsubscribe" link in any of our emails.
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
    const { error } = await useFetch('/api/subscribe', {
      method: 'POST',
      body: { email: email.value },
    })

    if (error.value) {
      throw new Error(error.value.statusMessage || 'Failed to subscribe')
    }

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
      text: error instanceof Error ? error.message : 'Something went wrong. Please try again later.',
      type: 'error',
    }
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto; /* Allow scrolling on small screens */
  padding-bottom: calc(1rem + var(--safe-area-inset-bottom)); /* Account for bottom safe area on iOS */
}

.content-card {
  width: 100%;
  max-width: 42rem;
  background-color: var(--color-bg-card);
  backdrop-filter: blur(4px);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(23, 59, 115, 0.2);
  border: 1px solid var(--color-border);
  padding: 1.5rem; /* Smaller padding on mobile */
  text-align: center;
}

.content-card>.inner-content>*+* {
  margin-top: 1.5rem;
}

.badge {
  display: inline-block;
  background-color: var(--color-accent-bg-light);
  color: var(--color-text-accent);
  border: 1px solid var(--color-accent-border-light);
  border-radius: 9999px;
  padding: 0.25rem 1rem;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.title {
  font-size: calc(var(--font-size-4xl) * 0.8); /* Slightly smaller on mobile */
  font-weight: 800;
  letter-spacing: -0.025em;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  background-image: linear-gradient(to right, var(--color-gradient-start), var(--color-gradient-end));
  word-break: break-word; /* Prevent overflow on small screens */
}

.tagline {
  font-size: var(--font-size-base); /* Smaller on mobile */
  color: var(--color-text-primary);
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

.description {
  color: var(--color-text-secondary);
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
}

.github-callout {
  padding-top: 1rem;
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.newsletter-signup {
  margin-top: 2rem;
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
}

.signup-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.signup-description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.signup-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.email-input {
  padding: 0.75rem 1rem;
  background-color: rgba(17, 24, 39, 0.7);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease;
  width: 100%;
  box-sizing: border-box; /* Ensure padding doesn't break layout */
}

.email-input:focus {
  outline: none;
  border-color: var(--color-text-accent);
}

.submit-button {
  background-image: linear-gradient(to right, var(--color-gradient-start), var(--color-gradient-end));
  color: #111827;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
  width: 100%; /* Full width on mobile */
}

.submit-button:hover {
  opacity: 0.9;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: var(--font-size-sm);
  word-break: break-word; /* Prevent overflow of error messages */
}

.form-message.success {
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.form-message.error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.privacy-notice {
  margin-top: 1.5rem;
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  padding: 0.75rem; /* Smaller padding on mobile */
  background-color: rgba(17, 24, 39, 0.3);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  text-align: left;
}

@media (min-width: 768px) {
  .content-card {
    padding: 3rem;
  }

  .title {
    font-size: var(--font-size-5xl);
  }

  .tagline {
    font-size: var(--font-size-xl);
  }

  .form-group {
    flex-direction: row;
  }

  .email-input {
    flex: 1;
  }

  .submit-button {
    white-space: nowrap;
    width: auto; /* Reset width on larger screens */
  }

  .privacy-notice {
    padding: 1rem;
  }
}
</style>
