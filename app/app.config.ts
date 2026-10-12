export default defineAppConfig({
  site: {
    repository: 'https://github.com/MattA-Official/moderation-fyi',
    // Branch that "Edit this page" links point at
    branch: 'dev',
    socials: [
      { label: 'GitHub', icon: 'i-simple-icons-github', to: 'https://github.com/MattA-Official/moderation-fyi' },
    ] as { label: string, icon: string, to: string }[],
  },
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'teal',
      neutral: 'slate',
    },
  },
})
