<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['animateAllTracksParallel', 'animateAllTracksSequential', 'togglePauseResume'])

let isPaused = ref(false)

function animate_all_parallel() {
    emit('animateAllTracksParallel')
}

function animate_all_sequential() {
    emit('animateAllTracksSequential')
}

function toggle_pause_resume() {
    emit('togglePauseResume', isPaused.value)
    isPaused.value = !isPaused.value
}

</script>

<template>
    <div class="animation-controls">
        <button @click="animate_all_parallel()">Parallel Animation</button>
        <button @click="animate_all_sequential()">Sequential Animation</button>
        <button @click="toggle_pause_resume()">
            {{ isPaused ? 'Resume Animation ▶' : 'Pause Animation ⏸' }}
        </button>
    </div>
</template>