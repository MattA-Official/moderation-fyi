<template>
  <div
    style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 60px;
      font-family: 'Inter', sans-serif;
      background-color: #111827;
      color: #d1d5db;
    "
  >
    <!-- Card -->
    <div
      style="
        width: 90%;
        max-width: 1000px;
        background-color: rgba(31, 41, 55, 0.7);
        backdrop-filter: blur(4px);
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(23, 59, 115, 0.2);
        border: 1px solid #374151;
        padding: 48px;
        text-align: center;
        position: relative;
        z-index: 1;
      "
    >
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        "
      >
        <!-- Title -->
        <h1
          style="
            margin: 0 0 24px 0;
            font-family: 'Lora', serif;
            font-weight: 800;
            font-size: 80px;
            line-height: 1.1;
            letter-spacing: -0.025em;
            background-image: linear-gradient(to right, #60a5fa, #5eead4);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-align: left;
            align-self: flex-start;
            width: 100%;
          "
        >
          {{ title }}
        </h1>

        <!-- Description/tagline -->
        <p
          v-if="description"
          style="
            font-size: 28px;
            line-height: 1.4;
            color: #d1d5db;
            max-width: 90%;
            margin: 0 0 32px 0;
            text-align: left;
            align-self: flex-start;
            width: 100%;
          "
        >
          {{ description }}
        </p>

        <!-- Icon if provided -->
        <!-- <div
          v-if="icon"
          style="
            margin: 24px 0;
            opacity: 0.9;
            align-self: flex-start;
          "
        >
          <Icon
            :name="icon"
            style="
              width: 120px;
              height: 120px;
            "
          />
        </div> -->

        <!-- Footer with logo or site name -->
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #374151;
            width: 100%;
          "
        >
          <img
            v-if="siteLogo"
            :src="siteLogo"
            style="height: 30px;"
          >
          <template v-else>
            <p
              v-if="siteName"
              style="
                font-size: 22px;
                font-weight: 700;
                margin: 0;
                color: #9ca3af;
              "
            >
              {{ siteName }}
            </p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { useOgImageRuntimeConfig } from '#og-image/app/utils'
import { useSiteConfig } from '#site-config/app/composables'

const props = defineProps({
  title: { type: String, required: false, default: 'moderation.fyi' },
  description: { type: String, required: false },
  // icon: { type: String, required: false },
  siteName: { type: String, required: false },
  siteLogo: { type: String, required: false },
})

// const runtimeConfig = useOgImageRuntimeConfig()
const siteConfig = useSiteConfig()

const siteName = props.siteName || siteConfig.name
const siteLogo = props.siteLogo || siteConfig.logo

// const IconComponent = runtimeConfig.hasNuxtIcon
//   ? resolveComponent('Icon')
//   : { render: () => 'Missing @nuxt/icon' }
</script>
