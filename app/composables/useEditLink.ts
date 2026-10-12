/** GitHub "edit this page" link for a content file, e.g. `guides/example.md` */
export function useEditLink(file: MaybeRefOrGetter<string | undefined>) {
  const { site } = useAppConfig()
  return computed(() => {
    const path = toValue(file)
    return path ? `${site.repository}/edit/${site.branch}/content/${path}` : undefined
  })
}
