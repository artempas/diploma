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