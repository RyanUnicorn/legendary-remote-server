<script setup>
    import { computed } from 'vue';

    const props = defineProps([
        'deviceId',
        'deviceName',
        'entities',
        'enableUpdate'
    ]);

    const color = computed(() => {
        if(props.enableUpdate) {
            return "var(--color-accent)";
        } else {
            return "var(--color-text)";
        }
    });

    const colorMute = computed(() => {
        if(props.enableUpdate) {
            return "var(--color-accent-mute)";
        } else {
            return "var(--color-background-mute)";
        }
    });

</script>

<template>
    <div class="neu-box overviewDevicesInfoCard">
        <h1>
            {{ props.deviceName}}
        </h1>
        <h2>
            {{ props.entities}} entities
        </h2>
        <div class="rectangle">
            {{ props.enableUpdate == true ? 'Enabled' : 'Disabled' }}
        </div>
    </div>
</template>

<style scoped>
.overviewDevicesInfoCard {
    width: 325px;
    height: 130px;
    padding-top: 12px;
    padding-left: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    transition: 200ms;
    color: var(--color-text);
    scroll-snap-align: start;

    & h1 {
        text-decoration: none;
        font-size: 1.5rem;
    }

    & h2 {
        color: var(--color-text-mute);
        text-decoration: none;
        margin-bottom: 12px;
        font-size: 1rem;
    }

    & .rectangle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 90px;
        height: 30px;
        color: v-bind(color);
        background-color: v-bind(colorMute);
        border-radius: 30px;
        font-size: 1rem;
    }

    &:hover {
        color: var(--color-accent);
        fill: var(--color-accent);
        box-shadow:  7px  7px 20px #bebebe,
                    -9px -9px 20px #ffffff;
    }
}
</style>