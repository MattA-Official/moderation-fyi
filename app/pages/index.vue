<template>
  <UPage>
    <UPageHero
      title="Practical moderation guides for volunteer community moderators"
      description="Open-source and community-driven resources to help you build and maintain healthy online communities."
      :links="[
        { label: 'Read the Guides', to: '/guides', icon: 'i-heroicons-book-open', size: 'lg' },
        { label: 'Browse Templates', to: '/templates', icon: 'i-heroicons-document-duplicate', color: 'neutral', variant: 'outline', size: 'lg' }
      ]"
    />

    <!-- <UPageLogos
      title="Trusted by communities using our resources"
      :items="['i-simple-icons-discord', 'i-simple-icons-reddit', 'i-simple-icons-slack', 'i-simple-icons-discourse', 'i-simple-icons-github']"
    /> -->

    <UPageSection
      title="What Moderators Say"
      description="Hear from community leaders who have used our resources to improve their moderation practices."
      class="bg-gray-50 dark:bg-gray-900/50"
    >
      <UPageGrid>
        <UPageCard
          icon="i-heroicons-chat-bubble-left-right"
          title="Invaluable Resource"
          description="The conflict resolution guide helped us de-escalate a major situation in our Discord server. Highly recommended!"
        />
        <UPageCard
          icon="i-heroicons-document-text"
          title="Saved Me Hours"
          description="I used the removal reason templates to set up our auto-mod responses. It saved me so much time and effort."
        />
        <UPageCard
          icon="i-heroicons-user-group"
          title="Better Community"
          description="Implementing the rule-setting guidelines transformed our community culture for the better."
        />
      </UPageGrid>
    </UPageSection>

    <UPageCTA
      title="Join the Community"
      description="moderation.fyi is built by moderators, for moderators. Contribute your own knowledge and help the community grow."
      :links="[{ label: 'About Us', to: '/about', color: 'neutral', variant: 'outline', size: 'lg' }]"
      class="bg-primary-50 dark:bg-primary-900/10"
    />
  </UPage>
</template>

<script lang="ts" setup>
defineOgImageComponent('Default')

useSeoMeta({
  title: 'Home',
})
</script>

<style scoped></style>
