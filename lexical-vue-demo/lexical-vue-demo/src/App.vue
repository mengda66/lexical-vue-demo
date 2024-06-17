<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Editor from './Editor.vue'

</script>

<template>
  <div class="editor-parent">
    <Editor/>
  </div>
</template>

<style scoped>
.editor-parent {
  padding: 10px;
  width: 500px;
  height: 500px;
  border: 1px solid #aaa;
  border-radius: 4px;
  overflow: scroll;
}
</style>
