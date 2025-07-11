<template>
  <header>
    <div class="header-content">
      <NuxtLink
        to="/"
        class="logo"
      >
        <AppLogo />
      </NuxtLink>
      <div>
        <nav>
          <NuxtLink
            to="/guides"
            class="nav-link"
          >
            Explore Guides
          </NuxtLink>
          <NuxtLink
            to="/articles"
            class="nav-link"
          >
            Read Articles
          </NuxtLink>
          <NuxtLink
            to="/templates"
            class="nav-link"
          >
            Browse Templates
          </NuxtLink>
          <span class="divider">•</span>
          <NuxtLink
            to="/contribute"
            class="nav-link"
          >
            Contribute
          </NuxtLink>
        </nav>
        <span>
          <!-- ~~colour~~ Theme picker -->
        </span>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>

</script>

<style scoped>
header {
  position: sticky;
  top: 0;
  width: 100%;
  border-bottom: 1px solid var(--colour-border);
  backdrop-filter: blur(8px);
  background-color: transparent;
  z-index: 10;
}

.header-content {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  max-width: var(--content-width);
  justify-content: space-between;
  margin: 0 auto;
  padding: var(--sm) var(--md);
}

nav {
  display: flex;
  width: auto;
  height: 100%;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
}

.logo {
  text-decoration: none;
}

a {
  color: var(--colour-text-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover,
a:focus-visible {
  color: var(--colour-primary);
}

.divider {
  color: var(--colour-text-secondary);
  font-weight: 600;
}
</style>
