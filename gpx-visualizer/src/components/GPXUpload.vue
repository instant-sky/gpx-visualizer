<script setup lang="ts">
import { ref, watch } from 'vue'

interface GPXFile {
  name: string
  file: File
  visible: boolean
}

const files = ref<GPXFile[]>([])

function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files) {
    for (const file of Array.from(input.files)) {
        files.value.push({ name: file.name, file, visible: true })
        files.value = [...files.value]; // after any change to trigger watcher
    }
  }
}

function toggleVisibility(index: number) {
  files.value[index].visible = !files.value[index].visible
}

// Emits files and their visibility to parent
const emit = defineEmits(['update:files'])
watch(files, () => {
    console.log("Files changed:", files.value);
  // Emit a new array reference to trigger reactivity
  emit('update:files', [...files.value.map(f => ({ ...f }))])
})
</script>

<template>
  <div class="gpx-upload">
    <input type="file" accept=".gpx" multiple @change="handleUpload" />
    <ul>
      <li v-for="(file, idx) in files" :key="file.name">
        {{ file.name }}
        <button @click="toggleVisibility(idx)">
          {{ file.visible ? 'Hide' : 'Show' }}
        </button>
      </li>
    </ul>
  </div>
</template>