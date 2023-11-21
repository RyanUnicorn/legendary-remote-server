<script setup>
</script>

<template>
    <div class="neu-box overviewDevicesAddingCard">
        <div>
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.overviewDevicesAddingCard {
    width: 325px;
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 200ms;
    color: var(--color-text-mute);
    fill: v-bind(color);

    & div {
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