<script>
export default {
  name: "DropzoneBackground"
}
</script>

<template>
  <div style="height: 100%; width: 100%">
    <Background :size="2" :gap="20" pattern-color="#BDBDBD">
      <slot />
    </Background>
  </div>
</template>

<style scoped>

</style>