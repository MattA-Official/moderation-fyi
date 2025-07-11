<template>
  <span class="logo">
    moderation.fyi
  </span>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.logo {
  font-size: var(--h4);
  font-weight: 1000;
  letter-spacing: -0.025em;
  color: transparent;
  background-clip: text;
  background-image: linear-gradient(to right, var(--colour-gradient-start), var(--colour-gradient-end));
  transition: background-position 0.8s ease;
  background-size: 200% 100%;
  background-position: 0% center;
}

.logo:hover,
.logo:focus-visible {
  text-decoration: none;
  background-position: 100% center;
}
</style>
