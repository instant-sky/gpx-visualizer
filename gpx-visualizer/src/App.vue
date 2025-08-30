<script setup lang="ts">
import { ref } from 'vue'
import Map from './components/Map.vue'
import GPXUpload from './components/GPXUpload.vue'
import AnimationControls from './components/AnimationControls.vue'

const gpxFiles = ref([])
const mapRef = ref()

function updateFiles(files: any) {
  gpxFiles.value = files
}

function handleAnimateAllTracksParallel() {
  if (mapRef.value && typeof mapRef.value.animate_all_tracks_parallel === 'function') {
    mapRef.value.animate_all_tracks_parallel();
  }
}

function handleAnimateAllTracksSequential() {
  if (mapRef.value && typeof mapRef.value.animate_all_tracks_sequential === 'function') {
    mapRef.value.animate_all_tracks_sequential();
  }
}

function handleTogglePauseResume(isPaused: boolean) {
  console.log('handling pause resume')
  if (mapRef.value && typeof mapRef.value.toggle_pause_resume === 'function') {
    mapRef.value.toggle_pause_resume(isPaused);
  }
}

</script>

<template>
  <div class="main-layout">
    <div class="flex-container">
      <GPXUpload @update:files="updateFiles" />
      <AnimationControls @animateAllTracksParallel="handleAnimateAllTracksParallel" @animateAllTracksSequential="handleAnimateAllTracksSequential" @togglePauseResume="handleTogglePauseResume"/>
    </div>
    <Map ref="mapRef" :gpxFiles="gpxFiles" />
  </div>
</template>