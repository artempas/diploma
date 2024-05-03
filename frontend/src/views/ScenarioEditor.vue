<script>
import {applyChanges, ConnectionMode, useVueFlow, VueFlow} from "@vue-flow/core";
import DropzoneBackground from "@/components/DropzoneBackground.vue";
import {watch} from "vue";
import ScenarioEditorSidebar from "@/components/ScenarioEditorSidebar.vue";
import {constructNode, updateLabel} from "@/tools/nodeBuilder";
import {apiRequest} from "@/tools/requests";
import {MiniMap} from "@vue-flow/minimap";
const { fitView, addEdges, onConnect, addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode, findNode, getIncomers, removeNodes, getOutgoers } = useVueFlow({ id: 'schema' })
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
    },
    showMenuModal: {
      get () {
        return this.showModal && this.element?.data?.type === 'menu';
      },
      set(v){
        this.showModal=v
      }
    }
  },
  components: {MiniMap, ScenarioEditorSidebar, DropzoneBackground, VueFlow},
  methods:{
    async createConnector(){
      const res = await apiRequest('post', `api/scenario/${this.$route.params.id}/connector/`, {
        platform:'telegram',
        token: this.telegram_token
      }, this.$toast)
      if (res.ok){
        this.connectors.push(res.data)
        this.showCreateConnector=false
        this.telegram_token='';
      }
    },
    addButton(){
      if (this.element.data.type==='menu'){
        const newButton=constructNode('menuButton', null, this.element, this.menu__buttons.length)[0];
        newButton.data.text='';
        this.menu__buttons.push(newButton);
        console.log(this.menu__buttons)
      }
    },
    deleteButton(id){
      this.menu__buttons_to_delete.push(id);
      if (this.element.data.type==='menu'){
        this.menu__buttons=this.menu__buttons.filter((e)=>e.id!==id)
      }
    },
    deleteConnector(event, id, data){
      this.$confirm.require({
        target: event.currentTarget,
        message: `Вы точно хотите удалить коннектор ${data.first_name} (@${data.username})`,
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-sm',
        rejectLabel: 'Отмена',
        acceptLabel: 'ДА!',
        accept: () => {
          apiRequest('delete', `/api/scenario/${this.$route.params.id}/connector/${id}`, null, this.$toast)
          .then((res)=>{
            if (res.ok){
              this.$toast.add({severity:'success', summary:'Коннектор удалён', life:3000});
              this.connectors=this.connectors.filter((c)=>c.id!==id);
            }
            else {
              this.$toast.add({severity:"error", summary:"Ошибка", detail: res.error, life: 3000})
            }
          })
        },
      });
    },
    saveSingleNode(){
      console.log(`Saving element ${JSON.stringify(this.element.data)}`)
      try {
        switch (this.element.data.type) {
          case 'init':
          case 'send_message':
            this.element.data.text = this.send_message__message_text;
            break;
          case 'assign': {
            this.element.data.variable = this.assign__variable_name;
            this.element.data.value = this.assign__value;
            break;
          }
          case 'input': {
            this.element.data.message = this.input__message_text;
            this.element.data.variable = this.input__variable_name;
            break;
          }
          case 'condition': {
            this.element.data.first_value=this.condition__first_value;
            this.element.data.second_value=this.condition__first_value;
            this.element.data.operation=this.condition__operation;
            this.element.data.negation=this.condition__negation;
            break;
          }
          case 'menu': {
            this.element.data.text = this.menu__message_text;
            this.saveChildren()
          }
        }
      } catch (e){
        console.log(JSON.stringify(e.message))
        this.$toast.add({severity: 'error', summary: 'Ошибка', detail: e.message, life:3000})
        return
      }
      updateLabel(this.element);
      if (this.element.data.type==='menu'){
        updateChildLocation(this.menu__child_elements)
      } else if (this.element.data.type==='condition'){
        updateChildLocation(this.schemaData.filter((e)=>e.parentNode===this.element.id))
      }
      this.unsaved_changes++;
      this.showModal=false
    },
    updateChildLocation(){},
    saveChildren(){
      if (!this.menu__buttons.length){
        throw new Error('Нельзя сохранить элемент меню без кнопок');
      }
      removeNodes(
        this.menu__buttons_to_delete
      );
      this.menu__buttons_to_delete=[];
      for (let i of this.menu__buttons){
        if (!i.data.text){
          throw new Error('Текст кнопки не может быть пустым');
        }
        let found = this.menu__child_elements.filter((j)=>i.id===j.id)[0];
        console.log(found)
        if (found){
          console.log('found')
          found.data.text=i.data.text;
        } else {
          console.log('not found')
          found = i;
          this.schemaData.push(found)
        }
        updateLabel(found);
        console.log(this.schemaData)
      }
    },
    nodeClick(e){
      this.element=findNode(e.node.id);
      if (this.element?.parentNode){
        this.element=findNode(this.element.parentNode)
      }
      console.log(`Clicked`)
      console.log(e.node)
      switch (this.element.data.type){
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
        case 'menu':
          this.menu__buttons_to_delete=[]
          this.menu__message_text=this.element.data.text;
          this.menu__child_elements=this.schemaData.filter((element)=>element.parentNode===this.element.id);
          this.menu__buttons=JSON.parse(JSON.stringify(this.menu__child_elements));
      }
      this.showModal=true;
    },
    onEdgesChanged(changes){
      changes.forEach((i)=> {
        if (i.item)
          i.item.animated=true;
        if (i.type === 'add' || i.type === 'remove')
          this.unsaved_changes += 1;
      }
    );
      applyChanges(changes, this.schemaData)
    },
    validateEdge(change){
      console.log('INCOMERS:')
      console.log(getIncomers(change.source))
      console.log(getIncomers(change.target))
      console.log('OUTGOERS:')
      console.log(getOutgoers(change.source))
      console.log(getOutgoers(change.target))
      if (change.sourceNode && change.targetNode) return true;
        return (
          change.sourceHandle.split('-').pop()!==change.targetHandle.split('-').pop()
          && change.source!==change.target
          && findNode(change.source).parentNode !== findNode(change.target)?.id
          && findNode(change.target).parentNode !== findNode(change.source)?.id
          && !getOutgoers(change.source).length
        )

    },
    onNodesChanged(changes){
      console.log(`NODE CHANGED ${JSON.stringify(changes)}`)
      changes.forEach(async (change)=>{
        console.log(findNode(change.id))
        if (this.ignore_validation || !(change.type==='remove' && (
              change.id==='init' ||
              findNode(change.id).parentNode && (
                  !this.menu__buttons_to_delete.includes(change.id)
              )
        )
        )){
          const kids=this.schemaData.filter(i=>i.parentNode===change.id)
          if (change.type==='remove' && kids.length ) {
            this.ignore_validation=true;
            removeNodes(kids)
            this.ignore_validation=false
          }
          applyChanges([change], this.schemaData)
          if (change.dragging===false)
            this.unsaved_changes++;
        }
      })
    },
    async saveSchema(){
      const response = await apiRequest('patch', `/api/scenario/${this.$route.params.id}/setVisual`, {visual_data: this.schemaData}, this.$toast);
      if (response.ok){
        this.unsaved_changes=0
        this.$toast.add({
          severity:'success',
          summary:'Схема сохранена',
          life:3000
        })
      }
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
        const {off} = onNodesInitialized(() => {
          updateNode(newNodes[0].id, (node) => ({
            position: {x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2},
          }))

          off()

        })
        addNodes(newNodes)
        this.unsaved_changes++;
      } catch (e){console.log(e)}
    }
  },
  data(){
    return{
      scenario_name:'',
      telegram_token:'',
      showCreateConnector:false,
      connectors:[],
      draggedType:null,
      isDragOver: false,
      isDragging: false,
      showModal:false,
      ignore_validation:false,
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
      menu__message_text:'',
      menu__child_elements:[],
      menu__buttons_to_delete:[],
      unsaved_changes: 0,
      menu__buttons:[{
        id:'0',
        data:{
          text:''
        }
      }]
    }
  },
  async mounted(){
    apiRequest('get', `/api/scenario/${this.$route.params.id}`, null, this.$toast).then((schema)=>{
      const schema_data=JSON.parse(schema.data.visual_data)
      this.schemaData =schema_data?.length ? schema_data: constructNode('init', {x:10, y:10})
      this.schemaData.map((el)=>updateLabel(el))
      this.scenario_name=schema.data.name;
    }).then(()=>fitView())
    apiRequest('get', `/api/scenario/${this.$route.params.id}/connector`, null, this.$toast).then((response)=>{
      this.connectors=response.data;
    })

    watch(this.isDragging, (dragging) => {
      document.body.style.userSelect = dragging ? 'none' : ''
    })
    this.unsaved_changes=0;
  },
  beforeMount() {
    // Register your event handler, can technically be called in any lifecycle phase
    // Skip this if you're using regular event handlers
    onConnect((params) => addEdges([params]))
  },
}
</script>

<template>
  <ConfirmPopup/>
  <Toast/>
  <div class="page">
    <div class="top-topbar">
    <Button icon="pi pi-arrow-left" @click="$router.go(-1)" label="Назад" style="float: left; width:150px; height:60px; font-size:20px;"/>
    <div class="text">{{scenario_name}}</div>
    </div>
    <div @drop="onDrop">
      <div class="topbar">
        <ScenarioEditorSidebar @onDragStart="onDragStart" />
        <div class="topbar-right-buttons p-overlay-badge">
          <div class="topbar-right-button Connectors" v-for="connector in connectors">
            <i class="pi pi-telegram" v-badge.danger="'x'" style="font-size:50px;" @click="deleteConnector($event, connector.id, connector.data)"/>
          </div>
          <Button class="topbar-right-button" icon="pi pi-plus" size="large" style="width: 50px" rounded @click="showCreateConnector=true"/>
          <Badge v-if="unsaved_changes" :value="unsaved_changes" severity="warning" style="z-index: 100;"/>
          <Button icon="pi pi-save" size="large" class="topbar-right-button" @click="saveSchema" label="Сохранить"/>
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
          :is-valid-connection="validateEdge"
          @nodes-change="onNodesChanged"
          @edges-change="onEdgesChanged"
          @node-click="nodeClick">
        <Background pattern-color="#aaa" :gap="16" />
        <DropzoneBackground
            :style="{
              backgroundColor: isDragOver ? '#c5c5c5' : 'transparent',
              transition: 'background-color 0.2s ease',
            }"
        />
        <MiniMap mask-color="#BBBBBB"/>
      </VueFlow>
    </div>
  </div>
  <Dialog v-model:visible="showCreateConnector" modal header="Создать коннектор">
    <div style="margin-bottom: 10px">Настройки</div>
    <FloatLabel class="luboy">
      <label  class="block text-900 font-medium mb-2">
        Токен
      </label>
      <Password v-model="telegram_token" required :feedback="false"/>
    </FloatLabel>
    <div style="margin-top: 10px">
      <Button type="button" label="Отмена" severity="secondary" @click="showCreateConnector=false"></Button>
      <Button type="button" label="Сохранить" @click="createConnector"></Button>
    </div>
  </Dialog>
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
  <Dialog v-model:visible="showMenuModal" modal header="Сообщение" style="width: 25rem">

    <div style="margin-bottom: 10px">Настройки</div>
    <FloatLabel class="luboy">
      <label  class="block text-900 font-medium mb-2">
        Сообщение
      </label>

      <Textarea v-model="menu__message_text" autoResize rows="5" cols="30" v-tooltip.right="variable_usage_tooltip" />
    </FloatLabel>
    <div style="margin-top: 10px; margin-bottom: 10px">Кнопки</div>
    <div class="menu-buttons-modal">
      <div class="menu-button-modal" v-for="button in menu__buttons">
        <FloatLabel class="luboy">
          <label  class="block text-900 font-medium mb-2" >Текст кнопки</label>
          <InputText v-model="button.data.text" v-tooltip.right="variable_usage_tooltip" :invalid="!button.data.text"/>
        </FloatLabel>
        <Button icon="pi pi-times" severity="danger" rounded outlined @click="deleteButton(button.id)"/>
      </div>
      <Button icon="pi pi-plus" @click="addButton" rounded severity="success" style="align-self: center"/>
    </div>
    <div style="margin-top: 10px">
      <Button type="button" label="Отмена" severity="secondary" @click="showModal=false"></Button>
      <Button type="button" label="Сохранить" @click="saveSingleNode"></Button>
    </div>
  </Dialog>
</template>

<style scoped>
.top-topbar{
  display:flex;
  flex-direction:row;
}
.basicflow{
  width:100%;
  height:750px;
  border: solid black 2px;
}
.text{
  display:flex;
  align-items: center;
  justify-content: center;
  height:60px;
  font-size: 50px;
  width:100%
}
.topbar{
  display:flex;
  flex-direction:row;
  width:100%;
  padding-top:10px;
  padding-bottom:10px;
}
.topbar-right-buttons{
  width:100%;
  height:60px;
  display:flex;
  flex-direction:row;
  row-gap: 5px;
  align-items: center;
  justify-content: flex-end;
}
.topbar-right-button{
  margin-left: 10px;
  height:50px;
}

.luboy{
  margin-top:30px
}
.menu-button-modal{
  display:flex;
  flex-direction:row;
  justify-content: space-between;
  row-gap: 15px;
  align-items: flex-end;
  width: 100%;
}
.menu-buttons-modal{
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  align-content: center;
  justify-content: center;
  row-gap: 10px;
}
</style>