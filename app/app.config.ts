export default defineAppConfig({
  site: {
    repository: 'https://github.com/MattA-Official/moderation-fyi',
    // Branch that "Edit this page" links point at
    branch: 'dev',
    // External links that skip the "you're leaving" check. Each entry covers
    // itself and everything beneath it.
    trustedLinks: [
      'https://github.com/MattA-Official/moderation-fyi',
      'https://github.com/moderation-fyi',
    ],
  },
  ui: {
    // One ink, one paper, one accent, plus a reserved red (error) and an
    // ochre (warning, used for stale content). Palettes live in main.css.
    colors: {
      primary: 'mf-teal',
      secondary: 'mf-teal',
      success: 'mf-teal',
      info: 'mf-teal',
      warning: 'mf-ochre',
      error: 'mf-red',
      neutral: 'mf-stone',
    },
    icons: {
      search: 'i-lucide-search',
      copy: 'i-lucide-copy',
      copyCheck: 'i-lucide-check',
      check: 'i-lucide-check',
      external: 'i-lucide-external-link',
      arrowRight: 'i-lucide-arrow-right',
      arrowLeft: 'i-lucide-arrow-left',
    },
    // Buttons: sans bold, radius-sm, at least 44px tall; primary is accent on-accent
    button: {
      slots: {
        base: 'rounded-[8px] font-sans font-bold min-h-11 disabled:opacity-100 aria-disabled:opacity-100 disabled:border-dashed',
      },
      compoundVariants: [
        { color: 'primary', variant: 'solid', class: 'bg-mf-accent text-mf-on-accent hover:bg-mf-accent-strong active:bg-mf-accent-strong disabled:bg-transparent disabled:text-mf-ink-muted disabled:ring disabled:ring-mf-rule aria-disabled:bg-transparent' },
        { color: 'neutral', variant: 'outline', class: 'ring-[1.5px] ring-mf-rule-strong text-mf-ink bg-transparent hover:bg-mf-paper-sunken hover:ring-mf-ink' },
        { color: 'neutral', variant: 'subtle', class: 'ring-[1.5px] ring-mf-rule-strong text-mf-ink bg-transparent hover:bg-mf-paper-sunken hover:ring-mf-ink' },
        { color: 'neutral', variant: 'ghost', class: 'text-mf-ink hover:bg-mf-paper-sunken' },
        { color: 'primary', variant: 'ghost', class: 'text-mf-accent hover:bg-mf-accent-soft hover:text-mf-accent-strong' },
        { color: 'primary', variant: 'link', class: 'text-mf-accent hover:text-mf-accent-strong underline underline-offset-[0.18em]' },
        { color: 'neutral', variant: 'link', class: 'text-mf-ink-muted hover:text-mf-ink' },
        { square: true, class: 'min-w-11 justify-center' },
      ],
    },
    // Pills: sentence case, sans bold 13/16, outline by default
    badge: {
      slots: {
        base: 'rounded-full font-sans font-bold text-[13px]/4 tracking-[0.01em] px-2 py-1',
      },
      defaultVariants: {
        color: 'neutral',
        variant: 'outline',
      },
      compoundVariants: [
        { color: 'neutral', variant: 'outline', class: 'ring-mf-rule text-mf-ink-muted bg-transparent' },
        { color: 'neutral', variant: 'solid', class: 'bg-mf-ink text-mf-paper' },
      ],
    },
    // Inputs: paper-raised ground, 1.5px rule-strong outline
    input: {
      slots: {
        base: 'rounded-[8px] font-sans bg-mf-paper-raised min-h-11',
      },
      compoundVariants: [
        { color: 'primary', variant: 'outline', class: 'ring-[1.5px] ring-mf-rule-strong hover:ring-mf-ink focus-visible:ring-[1.5px] focus-visible:ring-mf-ink' },
      ],
    },
    selectMenu: {
      slots: {
        base: 'rounded-[8px] font-sans bg-mf-paper-raised min-h-11',
      },
    },
    formField: {
      slots: {
        label: 'font-sans font-bold text-base text-mf-ink',
        // Form errors stay ink: the reserved red is for warnings that protect someone
        error: 'font-sans text-sm text-mf-ink',
      },
    },
    card: {
      slots: {
        root: 'rounded-[14px]',
      },
    },
    pageCard: {
      slots: {
        root: 'rounded-[14px]',
        title: 'font-serif text-[21px]/7 font-semibold text-mf-ink',
        description: 'font-serif text-base/[26px] text-mf-ink',
      },
      defaultVariants: {
        variant: 'outline',
      },
      compoundVariants: [
        { variant: 'outline', class: { root: 'ring-1 ring-mf-rule bg-mf-paper hover:ring-mf-rule-strong' } },
        { variant: 'subtle', class: { root: 'ring-1 ring-mf-rule bg-mf-paper-sunken' } },
      ],
    },
    pageHeader: {
      slots: {
        root: 'border-b border-mf-rule py-8 sm:py-12',
        title: 'font-serif font-semibold text-[32px]/10 sm:text-[44px]/[52px] sm:tracking-[-0.01em] text-mf-ink text-pretty',
        description: 'font-serif text-xl/8 sm:text-[22px]/[34px] text-mf-ink max-w-[48rem]',
        headline: 'font-sans text-sm text-mf-ink-muted mb-3',
      },
    },
    pageSection: {
      slots: {
        title: 'font-serif font-semibold text-[26px]/[34px] text-mf-ink',
        description: 'font-serif text-lg/[29px] text-mf-ink',
      },
    },
    breadcrumb: {
      slots: {
        link: 'font-sans text-sm',
      },
    },
    contentToc: {
      slots: {
        title: 'font-sans font-bold text-sm text-mf-ink',
        link: 'font-sans text-sm',
      },
    },
    contentSurround: {
      slots: {
        link: 'rounded-[14px] ring-1 ring-mf-rule hover:ring-mf-rule-strong hover:bg-transparent',
        linkTitle: 'font-serif font-semibold text-[21px]/7 text-mf-ink',
        linkDescription: 'font-serif text-base/[26px] text-mf-ink',
        linkLeadingIcon: 'text-mf-accent',
      },
    },
    // Callouts in content: soft ground, 4px top edge, never a side stripe
    prose: {
      callout: {
        slots: {
          base: 'border-0 border-t-4 rounded-[12px] px-6 pt-4 pb-6 font-serif text-base/[26px] text-mf-ink',
          icon: 'size-5',
        },
        compoundVariants: [
          { color: ['primary', 'secondary', 'success', 'info', 'neutral'], class: { base: 'bg-mf-accent-soft border-t-mf-accent text-mf-ink [&_a]:text-mf-ink [&_code]:text-mf-ink', icon: 'text-mf-accent' } },
          { color: 'warning', class: { base: 'bg-mf-stale-soft border-t-mf-stale text-mf-ink [&_a]:text-mf-ink [&_code]:text-mf-ink', icon: 'text-mf-stale' } },
          { color: 'error', class: { base: 'bg-mf-warning-soft border-t-mf-warning text-mf-ink [&_a]:text-mf-ink [&_code]:text-mf-ink', icon: 'text-mf-warning' } },
        ],
      },
      card: {
        slots: {
          base: 'rounded-[14px] border border-mf-rule bg-mf-paper hover:border-mf-rule-strong hover:bg-mf-paper',
          title: 'font-serif font-semibold text-[21px]/7 text-mf-ink',
          description: 'font-serif text-base/[26px] text-mf-ink',
          icon: 'text-mf-accent',
        },
      },
      steps: {
        base: 'ms-4 ps-8 border-s border-mf-rule',
      },
    },
  },
})
