<template>
  <div class="full-width full-height pos-rel">
    <visualiser-scene :beat-type="beatType" />
    <audio-controller v-if="initRef && playRef && pauseRef" :init-metronome="initMetronome" :kill-metronome="killMetronome" />
  </div>
</template>

<script setup>
// Module Imports
import { onMounted, ref } from 'vue';

// Component Imports
import VisualiserScene from '~/components/WebGL/VisualiserScene.vue';
import AudioController from '~/components/Audio/AudioController.vue';

// Get Audio Features
const trackID = ref('3s8ajx7VdP57N0A1t5MuFZ');
const initRef = ref(undefined);
const playRef = ref(undefined);
const pauseRef = ref(undefined);

onMounted(async () => {
  const trackData = await $fetch(`/api/spotify/getTrackData?trackID=${trackID.value}`);
  const { tempo, time_signature: meter } = trackData;
  const { init, play, pause } = useMetronome(tempo, meter, (beatType) => setBeat(beatType));
  initRef.value = init;
  playRef.value = play;
  pauseRef.value = pause;
});

// Metronome Controls
const beatType = ref(0);
const setBeat = (type) => beatType.value = type;
const initMetronome = () => {
  if (initRef.value && playRef.value) {
    initRef.value();
    playRef.value();
  }
}
const killMetronome = () => {
  pauseRef.value();
}
</script>

<style scoped>
button { 
  top: 50%;
}
</style>