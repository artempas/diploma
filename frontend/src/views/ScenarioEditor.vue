<script>
import {applyChanges, applyNodeChanges, ConnectionMode, useVueFlow, VueFlow} from "@vue-flow/core";
import DropzoneBackground from "@/components/DropzoneBackground.vue";
import {watch} from "vue";
import ScenarioEditorSidebar from "@/components/ScenarioEditorSidebar.vue";
import {constructNode, getLabel, typesMap, updateLabel} from "@/tools/nodeBuilder";
import {apiRequest} from "@/tools/requests";
import {MiniMap} from "@vue-flow/minimap";
const { addEdges, onConnect, addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode, findNode, toObject, fromObject } = useVueFlow({ id: 'schema' })
export default {
  name: "ScenarioEditor",
  computed: {
    ConnectionMode() {
      return ConnectionMode
    },
    showMessageModal:{
      get(){
        return this.showModal && (this.element?.data?.type==='init'||this.element?.data?.type==='send_message');
      },
      set(v){
        this.showModal=v
      }
    },
    showConditionModal:{
      get(){
        return this.showModal && this.element?.data?.type==='condition';
      },
      set(v){
        this.showModal=v
      }
    },
    showAssignmentModal: {
      get () {
        return this.showModal && this.element?.data?.type === 'assign';
      },
      set(v){
        this.showModal=v
      }
    },
    showInputModal: {
      get () {
        return this.showModal && this.element?.data?.type === 'input';
      },
      set(v){
        this.showModal=v
      }
    }
  },
  components: {MiniMap, ScenarioEditorSidebar, DropzoneBackground, VueFlow},
  methods:{
    saveSingleNode(){
      console.log(`Saving element ${JSON.stringify(this.element.data)}`)
      switch (this.element.data.type){
        case 'init':
        case 'send_message':
          this.element.data.text=this.send_message__message_text;
          break;
        case 'assign': {
          this.element.data.variable = this.assign__variable_name;
          this.element.data.value = this.assign__value;
          break;
        }
        case 'input':{
          this.element.data.message=this.input__message_text;
          this.element.data.variable=this.input__variable_name;
          break;
        }
        case 'condition':{
          this.element.data.message=this.input__message_text;
          this.element.data.variable=this.input__variable_name;
          break;
        }
      }
      updateLabel(this.element);
      updateNode(this.element.id, {
        label:this.element.label,
        data:this.element.data
      })
      console.log(`After save ${JSON.stringify(this.element.data)}`)
      this.showModal=false

    },
    nodeClick(e){
      this.element=findNode(e.node.id);
      console.log(`Clicked`)
      console.log(e.node)
      switch (e.node.data.type){
        case 'init':
        case 'send_message':
          this.send_message__message_text=this.element.data.text
          break;
        case 'assign':
          this.assign__value=this.element.data.value;
          this.assign__variable_name=this.element.data.variable;
          break;
        case 'input':
          this.input__message_text=this.element.data.message;
          this.input__variable_name=this.element.data.variable;
          break;
        case 'condition':
          this.condition__first_value=this.element.data.first_value;
          this.condition__second_value=this.element.data.second_value;
          this.condition__negation=this.element.data.negation;
          this.condition__operation=this.element.data.operation;
          break;
      }
      this.showModal=true;
    },
    onEdgesChanged(changes){
          applyChanges(changes, this.schemaData)
    },
    onNodesChanged(changes){
      console.log(`NODE CHANGED ${JSON.stringify(changes)}`)
      changes.forEach(async (change)=>{
        if (!(change.type==='remove' && change.id==='init')){
          console.log('Applying change')
          applyChanges([change], this.schemaData)
        }
      })
    },
    async saveSchema(){
      console.log(toObject())
      await apiRequest('patch', `/api/scenario/${this.$route.params.id}/setVisual`, {visual_data: this.schemaData}, this.$toast);
    },
    onDragStart (event, type) {
      if (event.dataTransfer) {
        event.dataTransfer.setData('application/vueflow', type)
        event.dataTransfer.effectAllowed = 'move'
      }
      this.draggedType = type
      this.isDragging = true
      console.log("HERE")

      document.addEventListener('drop', this.onDragEnd)
    },
    onDragOver (event){
      event.preventDefault()

      if (this.draggedType) {
        this.isDragOver = true

        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = 'move'
        }
      }
    },
    onDragLeave (){ this.isDragOver=false},
    onDragEnd () {
      this.isDragging = false
      this.isDragOver = false
      this.draggedType = null
      document.removeEventListener('drop', this.onDragEnd)
    },
    onDrop (event)  {
      try {
        const position = screenToFlowCoordinate({
          x: event.clientX,
          y: event.clientY,
        })


        const newNodes = constructNode(this.draggedType, position)
        console.log(newNodes)

        /**
         * Align node position after drop, so it's centered to the mouse
         *
         * We can hook into events even in a callback, and we can remove the event listener after it's been called.
         */
        const {off} = onNodesInitialized(() => {
          updateNode(newNodes[0].id, (node) => ({
            position: {x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2},
          }))

          off()

        })
        addNodes(newNodes)
      } catch (e){console.log(e)}
    }
  },
  data(){
    return{
      draggedType:null,
      isDragOver: false,
      isDragging: false,
      showModal:false,
      schemaData:[],
      element:{},
      variable_usage_tooltip:'В этом поле вы можете использовать переменные с помощью синтаксиса \${переменная}',
      send_message__message_text:'',
      assign__variable_name:'',
      assign__value:'',
      input__message_text:'',
      input__variable_name:'',
      condition__first_value: '',
      condition__operation: '=',
      condition__operations:['=', '>'],
      condition__second_value: '',
      condition__negation: false,
    }
  },
  async mounted(){
    const schema = await apiRequest('get', `/api/scenario/${this.$route.params.id}`)
    const schema_data=JSON.parse(schema.data.visual_data)
    this.schemaData =schema_data?.length ? schema_data: constructNode('init', {x:10, y:10})
    this.schemaData.map((el)=>updateLabel(el))
    watch(this.isDragging, (dragging) => {
      document.body.style.userSelect = dragging ? 'none' : ''
    })
  },
  beforeMount() {
    // Register your event handler, can technically be called in any lifecycle phase
    // Skip this if you're using regular event handlers
    onConnect((params) => addEdges([params]))
  },
}
</script>

<template>

  <Button icon="pi pi-arrow-left" @click="$router.go(-1)" label="Назад" style="float: left"/>

  <div @drop="onDrop">
    <div class="topbar">
      <ScenarioEditorSidebar @onDragStart="onDragStart" />
      <div class="topbar-buttons">
      <Button icon="pi pi-save" rounded @click="saveSchema"/>
      </div>
    </div>
    <VueFlow
        id="schema"
        class="basicflow"
        v-model="schemaData"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        :apply-changes="false"
        :apply-default="false"
        @nodes-change="onNodesChanged"
        @edges-change="onEdgesChanged"
        @node-click="nodeClick">
      <Background pattern-color="#aaa" :gap="16" />
      <DropzoneBackground
          :style="{
            backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
            transition: 'background-color 0.2s ease',
          }"
      />
      <MiniMap mask-color="#BBBBBB"/>
    </VueFlow>
  </div>
  <Dialog v-model:visible="showMessageModal" modal header="Сообщение" :style="{ width: '25rem' }">
    <div style="margin-bottom: 10px">Настройки</div>
    <FloatLabel class="luboy">
      <label  class="block text-900 font-medium mb-2">
        Сообщение
      </label>

      <Textarea v-model="send_message__message_text" autoResize rows="5" cols="30" v-tooltip.right="variable_usage_tooltip" />
    </FloatLabel>
    <div style="margin-top: 10px">
      <Button type="button" label="Отмена" severity="secondary" @click="showModal=false"></Button>
      <Button type="button" label="Сохранить" @click="saveSingleNode"></Button>
    </div>
  </Dialog>
  <Dialog v-model:visible="showAssignmentModal" modal header="Присвоение" :style="{ width: '25rem' }">
    <div style="margin-bottom: 10px">Настройки</div>
    <FloatLabel class="luboy">
      <label  class="block text-900 font-medium mb-2">Название переменной</label>
      <InputText v-model="assign__variable_name" />
    </FloatLabel>
    <FloatLabel class="luboy">
      <label  class="block text-900 font-medium mb-2" >Значение</label>
      <InputText v-model="assign__value"  v-tooltip.right="variable_usage_tooltip" />
    </FloatLabel>
    <div style="margin-top: 10px">
      <Button type="button" label="Отмена" severity="secondary" @click="showModal=false"></Button>
      <Button type="button" label="Сохранить" @click="saveSingleNode"></Button>
    </div>
  </Dialog>
  <Dialog v-model:visible="showInputModal" modal header="Ввод" :style="{ width: '25rem' }">
    <div style="margin-bottom: 10px">Настройки</div>
    <FloatLabel class="luboy">
      <label  class="block text-900 font-medium mb-2" >Текст вопроса</label>
      <Textarea v-model="input__message_text" autoResize rows="5" cols="30" v-tooltip.right="variable_usage_tooltip" />
    </FloatLabel>
    <FloatLabel class="luboy">
      <label  class="block text-900 font-medium mb-2">Название переменной</label>
      <InputText v-model="input__variable_name" />
    </FloatLabel>
    <div style="margin-top: 10px">
      <Button type="button" label="Отмена" severity="secondary" @click="showModal=false"></Button>
      <Button type="button" label="Сохранить" @click="saveSingleNode"></Button>
    </div>
  </Dialog>
  <Dialog v-model:visible="showConditionModal" modal header="Условие" :style="{ width: '25rem' }">
    <div style="margin-bottom: 10px">Настройки</div>
    <FloatLabel class="luboy">
      <label  class="block text-900 font-medium mb-2" >Значение 1</label>
      <InputText v-model="condition__first_value" v-tooltip.right="variable_usage_tooltip"/>
    </FloatLabel>
    <div style="display: flex;flex-direction:row">
      <SelectButton v-model="condition__operation" :options="condition__operations" :allow-empty="false"/>
      <ToggleButton v-model="condition__negation" onLabel="Инвертированно" offLabel="Не инвертированно" onIcon="pi pi-times"
                    offIcon="pi pi-check" />
    </div>
    <FloatLabel class="luboy">
      <label  class="block text-900 font-medium mb-2" >Значение 2</label>
      <InputText v-model="condition__second_value" v-tooltip.right="variable_usage_tooltip"/>
    </FloatLabel>
    <div style="margin-top: 10px">
      <Button type="button" label="Отмена" severity="secondary" @click="showModal=false"></Button>
      <Button type="button" label="Сохранить" @click="saveSingleNode"></Button>
    </div>
  </Dialog>
</template>

<style scoped>
.basicflow{
  width:100%;
  height:800px;
  border: solid black;
}

.topbar{
  display:flex;
  flex-direction:row;
  width:100%
}
.topbar-buttons{
  width:100%;
  display:flex;
  flex-direction:row;
  align-items: flex-end;
  justify-content: flex-end;
}
.luboy{
  margin-top:30px
}
</style>