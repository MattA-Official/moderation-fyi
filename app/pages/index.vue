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

        <div>
          <NuxtLink
            to="/guides"
            class="button"
          >
            Explore Guides
          </NuxtLink>
          <NuxtLink
            to="/articles"
            class="button"
          >
            Read Articles
          </NuxtLink>
          <NuxtLink
            to="/templates"
            class="button"
          >
            Browse Templates
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>

</script>

<style scoped>
body {
  max-height: 100vh;
  overflow: hidden;
}

.page-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.content-card {
  width: 100%;
  max-width: 42rem;
  background-color: var(--color-bg-card);
  backdrop-filter: blur(4px);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(23, 59, 115, 0.2);
  border: 1px solid var(--color-border);
  padding: 2rem;
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
  font-size: var(--font-size-4xl);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  background-image: linear-gradient(to right, var(--color-gradient-start), var(--color-gradient-end));
}

.tagline {
  font-size: var(--font-size-lg);
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
}
</style>
