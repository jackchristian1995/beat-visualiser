<template>
  <audio ref="audioControllerRef" class="pos-abs" src="/Mathilde_Anne_BREAK_feat_Des_Cortez.mp3" controls @play="initMetronome" @pause="killMetronome" @ended="killMetronome"></audio>
</template>

<script setup>
// Define Props
const props = defineProps({
  initMetronome: {
    type: Function,
    required: true
  },
  killMetronome: {
    type: Function,
    required: true,
  }
});
</script>

<style scoped>
audio {
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
}
</style>