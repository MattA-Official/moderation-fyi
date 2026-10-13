<template>
  <div class="min-h-screen flex flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 bg-mf-paper px-3 py-2 font-sans font-bold text-mf-accent"
    >Skip to content</a>

    <AppHeader />

    <main
      id="main"
      class="flex-1"
    >
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
