<script setup lang="ts">

const emit = defineEmits(['animateAllTracksParallel', 'animateAllTracksSequential'])

function animate_all_parallel() {
    emit('animateAllTracksParallel')
}

function animate_all_sequential() {
    emit('animateAllTracksSequential')
}

</script>

<template>
    <div class="animation-controls">
        <button @click="animate_all_parallel()">parallel animation</button>
        <button @click="animate_all_sequential()">sequential animation</button>
    </div>
</template>