<template>
  <Toast/>


  <SelectButton
      v-model="theme"
      :options="options"
      >
  </SelectButton>
<router-view></router-view>
</template>

<script>


import SelectButton from "primevue/selectbutton";
export default {
  name: 'App',
  components: { SelectButton },
  data:()=>({
    theme: 'light',
    options: ['light', 'dark']
  }),
  // watch: {
  //   theme: {
  //     handler(val) {
  //       this.$primevue.changeTheme(this.theme, val, 'theme', () => {
  //       })
  //       localStorage.setItem('theme',val)
  //     }, immediate: true
  //   }
  // }
}
</script>

<style>

#app {
  font-family: "Nunito", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  margin-top:10px;
  margin-left:10px;
  margin-right:10px;
}
</style>
