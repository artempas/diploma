<script>
import {applyChanges, applyNodeChanges, ConnectionMode, useVueFlow, VueFlow} from "@vue-flow/core";
import DropzoneBackground from "@/components/DropzoneBackground.vue";
import {watch} from "vue";
import ScenarioEditorSidebar from "@/components/ScenarioEditorSidebar.vue";
import {constructNode} from "@/tools/nodeBuilder";
import {apiRequest} from "@/tools/requests";
import MessageModal from "@/components/MessageModal.vue";
const { addEdges, onConnect, addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow({ id: 'schema' })
export default {
  name: "ScenarioEditor",
  computed: {
    ConnectionMode() {
      return ConnectionMode
    }
  },
  components: { MessageModal, ScenarioEditorSidebar, DropzoneBackground, VueFlow},
  methods:{
    saveMessage(){
      updateNode(this.element, (node) => ({
        data: {...node.data, text:this.message_text},
        label: 'Сообщение\n\n'+this.message_text
      }))
      this.showMessageModal=false;
    },
    nodeClick(e){
      switch (e.node.data.type){
        case 'send_message':
          this.element=e.node;
          this.message_text=this.element.data.text
          this.showMessageModal=true;
      }
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
      await apiRequest('patch', `/api/scenario/${this.$route.params.id}/setVisual`, {visual_data:this.schemaData});
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
        const { off } = onNodesInitialized(() => {
          updateNode(newNodes[0].id, (node) => ({
            position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 },
          }))

          off()

        })
      addNodes(newNodes)
    }
  },
  data(){
    return{
      draggedType:null,
      isDragOver: false,
      isDragging: false,
      showMessageModal:false,
      schemaData:[],
      element:{},
      message_text:''
    }
  },
  async mounted(){
    const schema = await apiRequest('get', `/api/scenario/${this.$route.params.id}`)
    const schema_data=JSON.parse(schema.data.visual_data)
    this.schemaData =schema_data?.length ? schema_data: constructNode('init', {x:10, y:10})
    console.log(this.schemaData)
    watch(this.isDragging, (dragging) => {
      document.body.style.userSelect = dragging ? 'none' : ''
    })
  },
  beforeMount() {
    // Register your event handler, can technically be called in any lifecycle phase
    // Skip this if you're using regular event handlers
    onConnect((params) => addEdges([params]))
  }
}
</script>

<template>
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
    </VueFlow>
  </div>
  <Dialog v-model:visible="showMessageModal" modal header="Сообщение" :style="{ width: '25rem' }">
    <div style="margin-bottom: 10px">Настройки</div>
    <FloatLabel class="luboy">
      <label  class="block text-900 font-medium mb-2">Сообщение</label>
      <Textarea v-model="element.data.text"  autoResize rows="5" cols="30" />
    </FloatLabel>
    <div style="margin-top: 10px">
      <Button type="button" label="Отмена" severity="secondary" @click="showMessageModal=false"></Button>
      <Button type="button" label="Сохранить" @click="saveMessage"></Button>
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