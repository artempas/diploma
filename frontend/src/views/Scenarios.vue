<script>

import ScenariosGrid from "@/components/ScenariosGrid.vue";
import axios from "axios";
import {apiRequest} from "@/tools/requests";

export default {
  name: "Scenarios",
  components: {ScenariosGrid},
  async created() {
    this.scenarios=await this.getScenarios();
  },
  methods:{
    async getScenarios(){
      const scenarios=(await apiRequest('get','api/scenario/all')).data;
      console.log(scenarios)
      return scenarios;
    },
    async deleteScenario(id){
      id=id+1;
      this.$toast.add({severity:"error", summary:'Ошибка', detail: 'BLA', life:3000})
      const deleted = await apiRequest('delete', `/api/scenario/${id}`, this.$toast);
      if (deleted.ok) {
        this.scenarios = this.scenarios.filter((scenario) => scenario.id !== id)
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
<ScenariosGrid :scenarios="scenarios" @delete-scenario="deleteScenario"></ScenariosGrid>
</template>

<style scoped>

</style>