<script>
export default {
  name: "ScenarioEditorSidebar",
  emits:['onDragStart']
}
</script>

<template>
    <div class="nodes">
      <div class="topbar-button vue-flow__node-default" :draggable="true" @dragstart="$emit('onDragStart', $event, 'send_message')">Сообщение</div>
      <div class="topbar-button vue-flow__node-default" :draggable="true" @dragstart="$emit('onDragStart', $event, 'input')">Ответ</div>
      <div class="topbar-button vue-flow__node-default" :draggable="true" @dragstart="$emit('onDragStart', $event, 'condition')">Условие</div>
      <div class="topbar-button vue-flow__node-default" :draggable="true" @dragstart="$emit('onDragStart', $event, 'assign')">
        Переменная
      </div>
      <div class="topbar-button vue-flow__node-default" :draggable="true" @dragstart="$emit('onDragStart', $event, 'menu')">
      Меню
      </div>
    </div>
</template>

<style scoped>
.nodes{
  display:flex;
  flex-direction:row;
  width:80%;
}
.topbar-button{
  height: 60px;
  display: flex;
  justify-content:center;
  align-items: center;
  font-size: 18px;
  font-weight: bolder;
  margin-right:10px;
}
</style>