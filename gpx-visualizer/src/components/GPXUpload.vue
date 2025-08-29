<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'

interface GPXFile {
  name: string
  file: File
  visible: boolean
}

const files = ref<GPXFile[]>([])

// Emits files and their visibility to parent
const emit = defineEmits(['update:files'])

function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files) {
    for (const file of Array.from(input.files)) {
      files.value.push({ name: file.name, file, visible: true })
    }
    files.value = [...files.value] // trigger reactivity
  }
}

function toggleVisibility(index: number) {
  files.value[index].visible = !files.value[index].visible
  files.value = [...files.value] // trigger reactivity
}

function onDragEnd() {
  files.value = [...files.value] // trigger reactivity
}

// Watch for changes and emit to parent
watch(files, () => {
  emit('update:files', [...files.value.map(f => ({ ...f }))])
})
</script>

<template>
  <div class="gpx-upload">
    <input type="file" accept=".gpx" multiple @change="handleUpload" />

    <draggable v-model="files" item-key="name" @end="onDragEnd">
      <template #item="{ element, index }">
        <li>
          {{ element.name }}
          <!--   <button @click="toggleVisibility(index)"> 
            {{ element.visible ? 'Hide' : 'Show' }}
          </button> -->
        </li>
      </template>
    </draggable>
  </div>
</template>

<style scoped>

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid cornflowerblue;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  cursor: grab;
  padding: 0.5rem 1rem;
}



button {
  margin-left: 1rem;
}
</style>
