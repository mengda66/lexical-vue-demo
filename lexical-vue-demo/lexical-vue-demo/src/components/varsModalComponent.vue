<template>
  <div class="vars-modal-container" :style="{ top: modalTop, left: modalLeft }">
    <ul>
      <li>q</li>
      <li>ww</li>
      <li>ee</li>
      <li>xx</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useLexicalComposer } from "lexical-vue";
import { ref, defineProps, watchEffect, computed, watch } from 'vue'

const props = defineProps(['matchInfoObj'])
const matchInfoObj = computed(() => props.matchInfoObj)
const editor = useLexicalComposer();

const modalTop = ref('0')
const modalLeft = ref('0')
const modalBottom = ref('0')
const modalRight = ref('0')

watch(matchInfoObj, (a) => {
  console.log('matchInfoObj change',a);
  positionMenu()
})

const positionMenu = () => {
  console.log('======positionMenu exec');
  
  const domSelection = window.getSelection()
  const anchorNode = domSelection?.anchorNode
  console.log('domSelection', domSelection);
  
  if (!anchorNode) return

  // 解析props的值
  if (!matchInfoObj.value) return
  const { fullTextContent, leadOffset, matchingString, replaceableString } = matchInfoObj.value
  console.log('aa', matchInfoObj.value);
  

  const range = document.createRange()
  range.setStart(anchorNode, leadOffset);
  range.setEnd(anchorNode, domSelection.anchorOffset);

  const rangeStyle = range.getBoundingClientRect()
  console.log(rangeStyle);
  const { left, top, width, height } = rangeStyle;
  modalTop.value = `${top + window.pageYOffset + height + 3}px`
  modalLeft.value = `${left + window.pageXOffset}px`;
  console.log(modalTop.value, modalLeft.value);
}
// watchEffect(positionMenu)

</script>

<style scoped>
.vars-modal-container {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 5555;
  background-color: bisque;
  height: 300px;
}
</style>