<script setup>
</script>

<template>
    <div class="neu-box IRCodeAddingCard">
        <svg class="w-6 h-6 text-gray-800 dark:text-white" style="padding: 1.4rem;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/></svg>
    </div>
</template>

<style scoped>
    .IRCodeAddingCard {
        width: 100%;
        height: 30%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 200ms;
        color: var(--color-text-mute);
        fill: v-bind(color);

        & svg {
            display: flex;
            height: 5rem;
            width: 5rem;
        }

        &:hover {
            color: var(--color-accent);
            fill: var(--color-accent);
            box-shadow:  7px  7px 20px #bebebe,
                        -9px -9px 20px #ffffff;
        }
    }
</style>