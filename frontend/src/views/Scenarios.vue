<script>

import ScenariosGrid from "@/components/ScenariosGrid.vue";
import {apiRequest} from "@/tools/requests";
import Toast from "primevue/toast";

export default {
  name: "Scenarios",
  components: {ScenariosGrid, Toast},
  async created() {
    this.scenarios=await this.getScenarios();
  },
  methods:{
    async getScenarios(){
      const scenarios=(await apiRequest('get','api/scenario/all', null, this.$toast)).data;
      console.log(scenarios)
      return scenarios;
    },
    async deleteScenario(id){
      const deleted = await apiRequest('delete', `/api/scenario/${id}`, null, this.$toast);
      if (deleted.ok) {
        this.scenarios = this.scenarios.filter((scenario) => scenario.id !== id)
        this.$toast.add({
          summary:"Сценарий удалён",
          life: 3000,
          severity:'success'
        })
      }
    }
  },
  data(){
    return {
      scenarios:[]
    }
  }
}
</script>

<template>
  <div class="text">Сценарии</div>
  <Toast></Toast>
<ScenariosGrid :scenarios="scenarios" @delete-scenario="deleteScenario"></ScenariosGrid>
</template>

<style scoped>
.text{
  font-size: 50px;
  margin-bottom: 30px;
}
</style>