<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'

const props = defineProps<{ gpxFiles: Array<{ name: string, file: File, visible: boolean }> }>()

const mapDiv = ref<HTMLElement | null>(null)
let map: L.Map | null = null

onMounted(() => {
  if (mapDiv.value) {
    map = L.map(mapDiv.value as HTMLDivElement).setView([51.505, -0.09], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)
  }
})

// Here you would watch props.gpxFiles and add/remove GPX layers accordingly
watch(() => props.gpxFiles, (newFiles) => {
  console.log(newFiles)
  // TODO: Add GPX parsing and rendering logic here
})
</script>

<template>
  <div ref="mapDiv" id="mapDiv"></div>
</template>