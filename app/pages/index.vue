<template>
  <main>
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>
    <h5>Heading 5</h5>
    <h6>Heading 6</h6>
    <p>This is a paragraph with <a href="#">a link</a> and some <strong>bold text</strong>.</p>
    <p>Another paragraph with <em>italic text</em> and a <code>code snippet</code>.</p>
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
    </ul>
    <ol>
      <li>Ordered item 1</li>
      <li>Ordered item 2</li>
      <li>Ordered item 3</li>
    </ol>
    <blockquote>
      This is a blockquote. It can contain multiple lines of text.
    </blockquote>
    <pre><code>console.log('This is a code block');</code></pre>
    <img
      src="https://placehold.co/300"
      alt="Example Image"
      width="300"
    >
  </main>
</template>

<script lang="ts" setup>
defineOgImageComponent('Default')

useSeoMeta({
  title: 'Home',
})
</script>

<style scoped>
/* body {
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
} */
</style>
