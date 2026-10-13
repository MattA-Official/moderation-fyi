<script lang="ts" setup>
const email = ref('')
const isSubmitting = ref(false)
const subscribed = ref(false)
const failure = ref('')

const building = [
  { icon: 'book-open', title: 'Guides', description: 'Step-by-step answers to the situations mods actually face.' },
  { icon: 'file-text', title: 'Templates', description: 'Rules, removal reasons and ban messages to copy and adapt.' },
  { icon: 'newspaper', title: 'Articles', description: 'What other mod teams tried, and what they\'d do differently.' },
] as const

const platforms = ['Discord servers', 'subreddits', 'Twitch channels', 'Matrix rooms', 'forums', 'group chats']

async function subscribeToNewsletter() {
  if (!email.value) return

  isSubmitting.value = true
  failure.value = ''

  try {
    await $fetch('/api/subscribe', {
      method: 'POST',
      body: { email: email.value },
    })
    subscribed.value = true
    email.value = ''
  }
  catch (error: unknown) {
    failure.value = (error as { data?: { message?: string } }).data?.message || 'That didn\'t work. Try again in a moment.'
  }
  finally {
    isSubmitting.value = false
  }
}

const faqs = [
  {
    question: 'What is moderation.fyi?',
    answer: 'A free, open-source library of practical moderation guides, copy-and-paste templates and articles for volunteer moderators, written by mods who\'ve done the job.',
  },
  {
    question: 'Which platforms does it cover?',
    answer: 'Discord servers, subreddits, Twitch channels, Matrix rooms, forums and group chats. Most advice works anywhere, and guides say when a platform\'s own settings matter.',
  },
  {
    question: 'What kind of guides and templates will there be?',
    answer: 'Things like writing server rules, welcoming new members, setting up AutoMod and removal reasons, running fair ban appeals, handling raids and building a mod team.',
  },
  {
    question: 'Is it free?',
    answer: 'Yes. There are no paywalls, accounts or tracking, and the content is published under a Creative Commons licence.',
  },
  {
    question: 'Can I help write it?',
    answer: 'Please do. The whole project is open on GitHub, and every contributor is credited on the guides they write.',
  },
]

// The homepage carries the brand first, so skip the " · moderation.fyi" suffix
useHead({ titleTemplate: null })
useSeoMeta({
  title: 'moderation.fyi: free guides and templates for volunteer mods',
  description: 'Free, open-source moderation guides and copy-and-paste templates for Discord, Reddit and Twitch mods: server rules, ban appeals, welcome messages and more. Launching soon.',
})

useSchemaOrg([
  defineWebPage({ '@type': 'FAQPage' }),
  ...faqs.map(faq => defineQuestion({ name: faq.question, acceptedAnswer: faq.answer })),
])
</script>

<template>
  <div class="mf-page">
    <header class="mf-shell header">
      <span class="mf-wordmark">moderation<span class="mf-wordmark__tld">.fyi</span></span>
    </header>

    <main class="mf-shell main">
      <section class="hero">
        <span class="mf-eyebrow">
          <MfIcon name="sparkles" />
          Coming soon · free and open source
        </span>
        <h1 class="mf-display">
          Moderation, written by <span class="mf-highlight">people who've done it.</span>
        </h1>
        <p class="mf-lede">
          Practical guides and copy-and-paste templates for volunteer mods on Discord, Reddit, Twitch and beyond. From writing your first rules to growing a mod team, and everything in between.
        </p>
      </section>

      <section
        class="mf-card mf-card--raised signup"
        aria-labelledby="signup-title"
      >
        <div class="signup__heading">
          <span class="mf-icon-tile"><MfIcon name="mail" /></span>
          <h2
            id="signup-title"
            class="mf-h3"
          >
            Hear when we launch
          </h2>
        </div>

        <p
          v-if="subscribed"
          class="mf-status mf-small"
          role="status"
        >
          <span class="mf-icon-tile"><MfIcon name="check" /></span>
          You're on the list. We'll email you when the first guides go up.
        </p>

        <form
          v-else
          @submit.prevent="subscribeToNewsletter"
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
              {{ isSubmitting ? 'Signing you up…' : 'Get the launch email' }}
            </button>
          </div>
          <p
            v-if="failure"
            class="mf-error"
            role="alert"
          >
            {{ failure }}
          </p>
        </form>

        <p class="mf-meta">
          One email when we launch and the occasional update after. We'll never share your address, and you can <NuxtLink
            to="/unsubscribe"
            class="mf-link"
          >unsubscribe</NuxtLink> at any time.
        </p>
      </section>

      <section
        class="building"
        aria-labelledby="building-title"
      >
        <h2
          id="building-title"
          class="mf-h2"
        >
          What we're building
        </h2>
        <div class="grid">
          <div
            v-for="item in building"
            :key="item.title"
            class="item"
          >
            <span class="mf-icon-tile"><MfIcon :name="item.icon" /></span>
            <h3 class="mf-h3">
              {{ item.title }}
            </h3>
            <p class="mf-small">
              {{ item.description }}
            </p>
          </div>
        </div>
      </section>

      <section
        class="mf-card platforms"
        aria-labelledby="platforms-title"
      >
        <div class="signup__heading">
          <span class="mf-icon-tile"><MfIcon name="messages-square" /></span>
          <h2
            id="platforms-title"
            class="mf-h3"
          >
            For wherever you mod
          </h2>
        </div>
        <ul class="mf-pills">
          <li
            v-for="platform in platforms"
            :key="platform"
            class="mf-pill"
          >
            {{ platform }}
          </li>
        </ul>
        <p class="mf-small">
          Good moderation travels. Where a platform's settings matter, the guide will tell you. Fancy helping write them? The project is <NuxtLink
            to="https://github.com/MattA-Official/moderation-fyi"
            target="_blank"
            class="mf-link"
          >open on GitHub</NuxtLink>.
        </p>
      </section>

      <section
        class="faq"
        aria-labelledby="faq-title"
      >
        <h2
          id="faq-title"
          class="mf-h2"
        >
          Questions you might have
        </h2>
        <div
          v-for="faq in faqs"
          :key="faq.question"
          class="faq__item"
        >
          <h3 class="mf-h3">
            {{ faq.question }}
          </h3>
          <p class="mf-small">
            {{ faq.answer }}
          </p>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.header {
  padding-block: 24px;
}

.main {
  display: grid;
  gap: 48px;
  padding-block: 32px 64px;
}

.hero {
  display: grid;
  gap: 24px;
  justify-items: start;
  max-inline-size: 48rem;
}

.signup,
.platforms {
  display: grid;
  gap: 16px;
  max-inline-size: 48rem;
}

.signup__heading {
  display: flex;
  align-items: center;
  gap: 12px;
}

.building {
  display: grid;
  gap: 24px;
}

.grid {
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
}

.item {
  display: grid;
  gap: 12px;
  justify-items: start;
}

.faq {
  display: grid;
  gap: 24px;
  max-inline-size: 48rem;
}

.faq__item {
  display: grid;
  gap: 8px;
  padding-block-start: 24px;
  border-block-start: 1px solid var(--rule);
}

@media (min-width: 768px) {
  .main {
    gap: 64px;
    padding-block: 48px 96px;
  }
}
</style>
