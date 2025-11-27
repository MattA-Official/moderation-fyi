<template>
  <div>
    <AppHeader />

    <UMain>
      <UContainer>
        <UPage>
          <slot />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>

</style>
