<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

/**
 * Asks before following any link off moderation.fyi, apart from the trusted
 * links in app.config. Works on every link on the page, including ones in
 * Markdown content. Without JavaScript, links simply work as normal.
 */
const { site } = useAppConfig()
const siteConfig = useSiteConfig()
const siteHost = new URL(siteConfig.url).hostname

const open = ref(false)
const destination = ref<{ href: string, host: string, newTab: boolean }>()

function onClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return

  const link = (event.target as Element | null)?.closest?.('a[href]')
  if (!(link instanceof HTMLAnchorElement) || link.hasAttribute('download') || 'leaveSite' in link.dataset) return

  let url: URL
  try {
    url = new URL(link.href, window.location.href)
  }
  catch {
    return
  }
  if (!['http:', 'https:'].includes(url.protocol)) return
  if (url.hostname === window.location.hostname || isOwnHost(url.hostname, siteHost)) return
  if (isTrustedLink(url, site.trustedLinks)) return

  event.preventDefault()
  destination.value = {
    href: url.href,
    host: url.hostname.replace(/^www\./, ''),
    newTab: link.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey,
  }
  open.value = true
}

useEventListener(import.meta.client ? document : undefined, 'click', onClick)
</script>

<template>
  <UModal
    v-model:open="open"
    title="You're leaving moderation.fyi"
    :description="destination ? `This link goes to ${destination.host}, a site we don't run. We can't vouch for what's on it.` : undefined"
    :ui="{ title: 'font-serif font-semibold text-[21px]/7 text-mf-ink', description: 'font-serif text-base/[26px] text-mf-ink' }"
  >
    <template #body>
      <p
        v-if="destination"
        class="font-mono text-sm text-mf-ink-muted break-all"
      >
        {{ destination.href }}
      </p>
    </template>

    <template #footer="{ close }">
      <div
        v-if="destination"
        class="flex flex-wrap gap-3"
      >
        <UButton
          :to="destination.href"
          :target="destination.newTab ? '_blank' : undefined"
          rel="noopener noreferrer"
          external
          data-leave-site
          :label="`Continue to ${destination.host}`"
          icon="i-lucide-external-link"
          @click="close"
        />
        <UButton
          label="Stay here"
          color="neutral"
          variant="outline"
          @click="close"
        />
      </div>
    </template>
  </UModal>
</template>
