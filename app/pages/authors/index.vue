<script setup lang="ts">
const { authors } = await useAuthors()
const { byAuthor } = await useContributions()

function count(id: string) {
  const total = byAuthor(id).length
  if (!total) return undefined
  return total === 1 ? '1 piece' : `${total} pieces`
}

useSeoMeta({
  title: 'Authors',
  description: 'The volunteer moderators who write moderation.fyi\'s guides, templates and articles.',
})

useSchemaOrg([
  defineWebPage({ '@type': 'CollectionPage' }),
])
</script>

<template>
  <div class="mx-auto max-w-page px-4 md:px-8">
    <header class="border-b border-mf-rule pt-8 pb-6 sm:pt-12 space-y-4">
      <h1 class="mf-h1">
        Authors
      </h1>
      <p class="mf-lede max-w-measure-wide">
        Everything here is written by volunteer mods, sharing what they've learnt on the job. These are the people behind it.
      </p>
    </header>

    <div class="py-8 space-y-10">
      <div class="mf-grid">
        <AuthorCard
          v-for="author in authors"
          :key="author.id"
          :name="author.name"
          :to="author.to"
          :description="author.description"
          :pronouns="author.pronouns"
          :avatar="author.avatar"
          :external="author.external"
          :meta="count(author.id)"
        />
      </div>

      <p class="font-serif text-lg/[29px] text-mf-ink max-w-measure-wide">
        Want to see your name here? <NuxtLink
          to="/contribute"
          class="mf-link"
        >Read the contributor guide</NuxtLink> and write up something you learnt the hard way.
      </p>
    </div>
  </div>
</template>
