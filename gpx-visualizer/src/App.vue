<script setup lang="ts">
import { ref } from 'vue'
import Map from './components/Map.vue'
import GPXUpload from './components/GPXUpload.vue'

const gpxFiles = ref([])

function updateFiles(files: any) {
  gpxFiles.value = files
}
</script>

<template>
  <div class="main-layout">
    <GPXUpload @update:files="updateFiles" />
    <Map :gpxFiles="gpxFiles" />
  </div>
</template>