<script>
export default {
  name: "ScenarioEditorSidebar",
  emits:['onDragStart']
}
</script>

<template>
  <aside>
    <div class="description">You can drag these nodes to the pane.</div>

    <div class="nodes">
      <div class="vue-flow__node-default" :draggable="true" @dragstart="$emit('onDragStart', $event, 'send_message')">Сообщение</div>
      <div class="vue-flow__node-default" :draggable="true" @dragstart="$emit('onDragStart', $event, 'input')">Ответ</div>
      <div class="vue-flow__node-default" :draggable="true" @dragstart="$emit('onDragStart', $event, 'condition')">Условие</div>
      <div class="vue-flow__node-default" :draggable="true" @dragstart="$emit('onDragStart', $event, 'assign')">
        Переменная
      </div>
      <div class="vue-flow__node-default" :draggable="true" @dragstart="$emit('onDragStart', $event, 'menu')">
      Меню
      </div>

    </div>
  </aside>
</template>

<style scoped>
.nodes{
  display:flex;
  flex-direction:row;
  width:80%
}
</style>