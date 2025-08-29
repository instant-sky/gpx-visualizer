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

function handleAnimateAllTracks() {
  if (mapRef.value && typeof mapRef.value.animate_all_tracks === 'function') {
    mapRef.value.animate_all_tracks();
  }
}
</script>

<template>
  <div class="main-layout">
    <div class="flex-container">
      <GPXUpload @update:files="updateFiles" />
      <AnimationControls @animateAllTracks="handleAnimateAllTracks"/>
    </div>
    <Map ref="mapRef" :gpxFiles="gpxFiles" />
  </div>
</template>