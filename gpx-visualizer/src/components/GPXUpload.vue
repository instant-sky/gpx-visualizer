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
    }
  }
}

function toggleVisibility(index: number) {
  files.value[index].visible = !files.value[index].visible
}

// Emits files and their visibility to parent
const emit = defineEmits(['update:files'])
watch(files, () => {
  // Emit a copy to avoid mutation issues
  // Parent can listen to "update:files"
  emit('update:files', files.value.map(f => ({ ...f })))
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

<style scoped>
.gpx-upload {
  padding: 1rem;
  border-right: 1px solid #ccc;
  min-width: 220px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
}
button {
  margin-left: 1rem;
}
</style>