<template>
  <div></div>
</template>
  
<script setup lang="ts">
import { $getSelection, COMMAND_PRIORITY_EDITOR, FOCUS_COMMAND } from "lexical";
import { useLexicalComposer } from "lexical-vue";
import { nextTick, onMounted, watch, defineProps } from "vue";

const props = defineProps(["state"]);
const emit = defineEmits(['modalVisibleChange'])

const PUNCTUATION =
  "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";

const trigger = "{";
const minLength = 0;
const maxLength = 0;

onMounted(() => {
  const editor = useLexicalComposer();
  editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {

        const selection = $getSelection();
        const anchor = selection.anchor;

        const anchorNode = anchor.getNode();

        const selectionOffset = anchor.offset;
        const textContent = anchorNode
          .getTextContent()
          .slice(0, selectionOffset);

        const validChars = `[${PUNCTUATION}\\s]`;
        const TypeaheadTriggerRegex = new RegExp(
          "(.*)(" +
            `[${trigger}]` +
            `((?:${validChars}){0,${maxLength}})` +
            ")$"
        );

        const match = TypeaheadTriggerRegex.exec(textContent);
        console.log("match", match);
        if (match) {
          emit('modalVisibleChange', true)
        } else {
          emit('modalVisibleChange', false)
        }
      });
    });

  editor.registerCommand(
    FOCUS_COMMAND,
    (e) => {
      console.log("focus", e);

      // The latest EditorState can be found as `editorState`.
      // To read the contents of the EditorState, use the following API:

      // Just like editor.update(), .read() expects a closure where you can use
      // the $ prefixed helper functions.

      // nextTick(() => {
      //   editor.update(() => {
      //     const selection = $getSelection();
      //     const anchor = selection.anchor;

      //     const anchorNode = anchor.getNode();

      //     const selectionOffset = anchor.offset;
      //     const textContent = anchorNode
      //       .getTextContent()
      //       .slice(0, selectionOffset);
      //     console.log(
      //       "selection",
      //       selection,
      //       selection.anchor.getNode().selectStart(),
      //       selection.anchor.getNode().getPreviousSibling()
      //     );

      //     const validChars = `[${PUNCTUATION}\\s]`;
      //     const TypeaheadTriggerRegex = new RegExp(
      //       "(.*)(" +
      //         `[${trigger}]` +
      //         `((?:${validChars}){0,${maxLength}})` +
      //         ")$"
      //     );

      //     const match = TypeaheadTriggerRegex.exec(textContent);
      //     console.log("match", match);
      //   });
      // });
      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );
});
</script>
  
<style scoped>
</style>