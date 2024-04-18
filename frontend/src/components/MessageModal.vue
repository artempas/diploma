<script>

export default {
  name: "MessageModal",
  emits:[
    'MODAL_SAAAAAAAAAAAAAAAAAAAAAVVED',
    'MODAL_CLOOOOOSED'
  ],
  props:[
    'visible',
    'elementData'
  ]
  ,
  methods:{
    saveElement(){
      this.elementData.data.text=this.message_text;
      this.$emit('MODAL_SAAAAAAAAAAAAAAAAAAAAAVVED')
    }
  },
}
</script>

<template>

</template>

<style scoped>

</style>