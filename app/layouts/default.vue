<template>
  <div>
    <UBanner
      id="moderation-fyi-preview"
      icon="i-lucide-construction"
      title="moderation.fyi is in early development. New guides and templates are on the way!"
      color="primary"
      close
    />

    <AppHeader />

    <UMain>
      <slot />
    </UMain>

    <AppFooter />
  </div>
</template>
