<script setup lang="ts">

const emit = defineEmits(['animateAllTracks'])

function animate_all() {
    console.log("Animate all tracks - not yet implemented");
    emit('animateAllTracks')
}

</script>

<template>
    <div class="animation-controls">
        <button @click="animate_all()">Animate All Tracks</button>
    </div>
</template>