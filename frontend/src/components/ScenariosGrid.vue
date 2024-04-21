<template>
  <ConfirmDialog></ConfirmDialog>

  <div class="myGrid">
    <Card @click="modal=true" :class="'myCard1 ' + (!scenarios.length? 'pulse': '')">
      <template #title>Создать сценарий</template>
      <template #footer>
        <div class="flex gap-3 mt-1">
          <Button icon="pi pi-plus" class="big-button"/>
        </div>
      </template>
    </Card>
    <ScenarioCard :key="scenario.id" v-for="scenario in scenarios"
    :scenario="scenario"
    @scenario-delete="deleteScenarioConfirm(scenario.id)"
    @scenario-open="$router.push(`/scenarios/${scenario.id}`)"
    />
  </div>

  <Dialog v-model:visible="modal" modal header="Создать сценарий" :style="{ width: '25rem' }">
    <div class="modal-form">
      <FloatLabel>
      <label for="name" class="font-semibold w-6rem">Название</label>
      <InputText id="name" class="flex-auto" autocomplete="off" v-model="scenario_name"/>
      </FloatLabel>
    </div>

    <div class="modal-buttons">
      <Button class='modal-button' type="button" label="Отмена" severity="secondary" @click="modal = false"></Button>
      <Button class='modal-button' type="button" icon='pi pi-save' label="Сохранить" @click="createScenario"></Button>
    </div>
  </Dialog>
</template>
<script>
import ScenarioCard from "@/components/ScenarioCard.vue";
import {apiRequest} from "@/tools/requests";
import router from "@/router";
export default {
  name: 'ScenarioGrid',
  props:{
    scenarios: Array
  },
  data(){
    return {
      modal: false,
      scenario_name:'',
    }
  },
  components:{
    ScenarioCard
  },
  emits:['delete-scenario'],
  mounted() {
    console.log(`SCENARIO GRID ${JSON.stringify(this.scenarios)}`)
  },
  methods:{
    router() {
      return router
    },
    deleteScenarioConfirm(id){
      this.$confirm.require({
        message:"Вы точно хотите удалить сценарий?",
        header:"Внимание!",
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        rejectLabel: 'Отмена',
        acceptLabel: 'Удалить',
        accept:async () => {
            this.$emit('delete-scenario', id)
        },
      })
    },
    async createScenario(){
      const scenario = await apiRequest('post', '/api/scenario/', {
        name: this.scenario_name
      }, this.$toast);
      if (!scenario.ok){
        this.$toast.add({
          summary:'Ошибка получения сценариев',
          detail: scenario.error,
          life:3000,
          severity:"error"
        })
        return;
      }
      this.scenarios.push(scenario.data);
      this.modal=false;
      this.scenario_name='';
    }
  }
}
</script>

<style scoped>


.myGrid{
  display:flex;
  flex-wrap: wrap;
}

.modal-buttons{
  display: flex;
  justify-content:end;
}
.big-button {
  margin-top:10px;
  width:50px;
  height:50px;
}

.modal-button{
  margin:5px;
}
.myCard1{
  cursor: pointer;
  width: 300px;
  margin:10px;
  border:solid 1px black;
}

.modal-form{
  display:flex;
  justify-content: center;
  margin-top:20px;
  margin-bottom:15px
}
@media only screen and (max-width: 1000px){
  .myGrid{
    display:flex;
    justify-content: center;
  }
}
.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
  }
}
</style>