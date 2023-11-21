<script setup>
import EditableTextInline from '../components/shared/EditableTextInline.vue';
function handleRename(name) {
    console.log('renameing to', name);
}
</script>

<template>
    <div>
        <EditableTextInline
            text="WOW"
            @rename="handleRename"
        />
    </div>
</template>

<style scoped>

</style>
