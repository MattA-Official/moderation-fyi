<template>
  <header>
    <NuxtLink to="/">
      <AppLogo />
    </NuxtLink>
    <nav>
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
    </nav>
    <span>
      <!-- colour picker -->
    </span>
  </header>
</template>

<script lang="ts" setup>

</script>

<style scoped>
header {
  display: flex;
  width: 100%;
  max-width: var(--content-width);
  justify-content: space-between;
  margin: 0 auto;
}

nav {
  display: flex;
  width: auto;
  gap: 1rem;
  justify-content: center;
}
</style>
