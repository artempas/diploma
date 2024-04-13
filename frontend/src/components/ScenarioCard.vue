<script>
import scenarios from "@/views/Scenarios.vue";

export default {
  name: "ScenarioCard",
  props:{
    scenario: Object
  },
  emits:['scenario-delete'],

}
</script>

<template>
  <Card class="myCard">
      <template #title>{{scenario.name}}</template>
      <template #footer>
        <div class="flex gap-3 mt-1">
          <Button label="Открыть" severity="primary" outlined class="w-full" style="margin:10px" />
          <Button icon="pi pi-trash" severity="danger" class="w-full" @click="$emit('scenario-delete')" style="margin:10px"/>
        </div>
      </template>
    </Card>

</template>

<style scoped>
.myCard{
  width: 300px;
  margin:10px;
}



</style>