<script setup lang="ts">
const route = useRoute()

const { data: author } = await useAsyncData(route.path, () => queryCollection('authors').path(route.path).first())
// Authors who link to their own site don't have a bio page
if (!author.value || author.value.link) {
  throw createError({ statusCode: 404, statusMessage: 'Author not found', fatal: true })
}

const { byAuthor } = await useContributions()
const contributions = computed(() => byAuthor(authorId(author.value!.stem)))

const facts = computed(() => [
  author.value?.moderatingSince && `Moderating since ${author.value.moderatingSince}`,
  author.value?.platforms.length && `On ${author.value.platforms.map(platformLabel).join(', ')}`,
].filter(Boolean) as string[])

useSeoMeta({
  title: author.value.seo?.title || author.value.name,
  description: author.value.seo?.description || author.value.description,
  ogType: 'profile',
  ogImage: author.value.avatar?.src,
})

useSchemaOrg([
  defineWebPage({ '@type': 'ProfilePage' }),
  definePerson({
    name: author.value.name,
    description: author.value.description,
    image: author.value.avatar?.src,
    sameAs: author.value.links.map(link => link.url),
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Authors', item: '/authors' },
      { name: author.value.name },
    ],
  }),
])
</script>

<template>
  <ContentLayout v-if="author">
    <template #header>
      <header class="border-b border-mf-rule pt-8 pb-6 sm:pt-12 space-y-4">
        <NuxtLink
          to="/authors"
          class="mf-link mf-link--quiet inline-flex items-center gap-1 font-sans text-sm"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="size-4"
            aria-hidden="true"
          />
          All authors
        </NuxtLink>

        <div class="flex flex-wrap items-center gap-x-6 gap-y-4">
          <UAvatar
            :src="author.avatar?.src"
            :alt="author.avatar?.alt || author.name"
            class="size-24 text-3xl shrink-0 bg-mf-accent-soft text-mf-accent font-sans font-bold"
          />
          <div class="space-y-1">
            <h1 class="mf-h1 text-pretty">
              {{ author.name }}
            </h1>
            <p
              v-if="author.pronouns"
              class="mf-meta"
            >
              {{ author.pronouns }}
            </p>
          </div>
        </div>

        <p class="mf-lede max-w-measure-wide">
          {{ author.description }}
        </p>

        <p
          v-if="facts.length"
          class="mf-meta"
        >
          <span
            v-for="fact in facts"
            :key="fact"
          >{{ fact }}</span>
        </p>
      </header>
    </template>

    <ContentRenderer
      :value="author"
      class="mf-prose"
    />

    <section
      v-if="author.links.length"
      aria-labelledby="elsewhere"
    >
      <h2
        id="elsewhere"
        class="mf-h2 mb-3"
      >
        Elsewhere
      </h2>
      <ul class="space-y-1">
        <li
          v-for="link in author.links"
          :key="link.url"
          class="font-serif text-lg/[29px]"
        >
          <NuxtLink
            :to="link.url"
            external
            class="mf-link"
          >{{ link.label }}</NuxtLink>
          <UIcon
            name="i-lucide-external-link"
            class="size-4 ms-1 align-[-2px] text-mf-ink-muted"
            aria-label="(external)"
          />
        </li>
      </ul>
    </section>

    <section aria-labelledby="written">
      <h2
        id="written"
        class="mf-h2 mb-4"
      >
        Written by {{ author.name }}
      </h2>
      <div
        v-if="contributions.length"
        class="mf-grid"
      >
        <ResourceCard
          v-for="item in contributions"
          :key="item.path"
          :to="item.path"
          :title="item.title"
          :description="item.description"
          :format="item.format"
          :meta="formatDate(item.date)"
        />
      </div>
      <p
        v-else
        class="font-serif text-lg/[29px] text-mf-ink"
      >
        Nothing published yet.
      </p>
    </section>

    <PageFooterLinks :file="`${author.stem}.${author.extension}`" />
  </ContentLayout>
</template>
