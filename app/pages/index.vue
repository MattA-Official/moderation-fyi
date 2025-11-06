<template>
  <UContainer>
    <ProseH1>Heading 1</ProseH1>
    <ProseH2>Heading 2</ProseH2>
    <ProseH3>Heading 3</ProseH3>
    <ProseH4>Heading 4</ProseH4>
    <ProseH5>Heading 5</ProseH5>
    <ProseH6>Heading 6</ProseH6>
    <ProseP>
      This is a paragraph with <ProseA href="#">
        a link
      </ProseA> and some <ProseStrong>bold text</ProseStrong>.
    </ProseP>
    <ProseP>Another paragraph with <ProseEm>italic text</ProseEm> and a <ProseCode>code snippet</ProseCode>.</ProseP>
    <ProseUl>
      <ProseLi>List item 1</ProseLi>
      <ProseLi>List item 2</ProseLi>
      <ProseLi>List item 3</ProseLi>
    </ProseUl>
    <ProseOl>
      <ProseLi>Ordered item 1</ProseLi>
      <ProseLi>Ordered item 2</ProseLi>
      <ProseLi>Ordered item 3</ProseLi>
    </ProseOl>
    <ProseBlockquote>
      This is a blockquote. It can contain multiple lines of text.
    </ProseBlockquote>
    <ProsePre>
      <ProseCode>console.log('This is a code block');</ProseCode>
    </ProsePre>
    <img
      src="https://placehold.co/300"
      alt="Example Image"
      width="300"
    >
  </UContainer>
</template>

<script lang="ts" setup>
defineOgImageComponent('Default')

useSeoMeta({
  title: 'Home',
})
</script>

<style scoped>

</style>
