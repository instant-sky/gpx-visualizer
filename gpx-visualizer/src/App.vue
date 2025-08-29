<script setup lang="ts">
import { ref } from 'vue'
import Map from './components/Map.vue'
import GPXUpload from './components/GPXUpload.vue'
import AnimationControls from './components/AnimationControls.vue'

const gpxFiles = ref([])

function updateFiles(files: any) {
  gpxFiles.value = files
}
</script>

<template>
  <div class="main-layout">
    <div class="flex-container">
      <GPXUpload @update:files="updateFiles" />
      <AnimationControls />
    </div>
    <Map :gpxFiles="gpxFiles" />
  </div>
</template>