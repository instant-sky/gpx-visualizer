<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/Map.vue'
import GPXUpload from './components/GPXUpload.vue'

const gpxFiles = ref([])

function updateFiles(files: any) {
  gpxFiles.value = files
}
</script>

<template>
  <div class="main-layout">
    <GPXUpload @update:files="updateFiles" />
    <HelloWorld :gpxFiles="gpxFiles" />
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
}
</style>