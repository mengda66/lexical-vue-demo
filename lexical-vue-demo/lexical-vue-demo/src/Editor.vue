<template>
  <LexicalComposer :initial-config="config">
    <div class="editor-container">
      <LexicalRichTextPlugin>
        <template #contentEditable>
          <div>
            <LexicalContentEditable style="outline: none; min-height: 300px" />
          </div>
        </template>
        <template #placeholder>
          <div class="editor-placeholder">Enter some text...</div>
        </template>
      </LexicalRichTextPlugin>
      <LexicalHistoryPlugin />
      <LexicalOnChangePlugin @change="onChange" />
      <onFocusComponent :state="editorState" @modalVisibleChange="onModalVisibleChange"/>

      <Teleport to="body">
        <varsModalComponent v-show="modalVisible" :matchInfoObj="matchInfoObj"/>
      </Teleport>
    </div>
  </LexicalComposer>
</template>

<script setup lang="ts">
import onFocusComponent from "./components/onFocus.vue";
import varsModalComponent from './components/varsModalComponent.vue'

import {
  $getRoot,
  $getSelection,
  COMMAND_PRIORITY_EDITOR,
  FOCUS_COMMAND,
} from "lexical";
import {
  LexicalComposer,
  LexicalOnChangePlugin,
  LexicalContentEditable,
  LexicalHistoryPlugin,
  LexicalPlainTextPlugin,
  LexicalRichTextPlugin,
} from "lexical-vue";
import { onMounted, ref, Teleport } from "vue";

const config = {
  namespace: "MyEditor",
  editable: true,
  theme: {
    // Theme styling goes here
  },
  onError(error: any) {
    console.error(error);
  },
};
const editorState = ref()

const onChange = (e: any) => {
  // console.log("change", e);
  editorState.value = e
};

const modalVisible = ref(false)
const matchInfoObj = ref(null)
const onModalVisibleChange = (flag: boolean, matchObj: any) => {
  if (flag) {
    matchInfoObj.value = matchObj
  }
  modalVisible.value = flag
  console.log(matchObj);
}
</script>

<style scoped>
.editor-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.editor-placeholder {
  position: absolute;
  top: 0;
  opacity: 0.5;
  z-index: -1;
}
</style>