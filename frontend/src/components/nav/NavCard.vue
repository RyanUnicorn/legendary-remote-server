<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

    const props = defineProps([
        'text',
        'currentRoute',
        'myRoute'
    ]);

    const color = computed(() => {
        if(props.currentRoute == props.myRoute) {
            return "var(--color-accent)";
        } else {
            return "var(--color-text)";
        }
    });

</script>

<template>
    <div class="neu-box nav-card">
        <div>
            <slot></slot>
        </div>
        <h1>
            {{ props.text }}
        </h1>
    </div>
</template>

<style scoped>
.nav-card {
    width: calc(var(--nav-width) - 2*var(--spacing-const));
    padding: 0.87rem 0;
    display: flex;
    align-items: center;
    transition: 200ms;
    color: v-bind(color);
    fill: v-bind(color);

    & h1 {
        text-decoration: none;
        font-size: 1.1rem;
    }

    & div {
        display: flex;
        align-items: center;
        margin-left: 2rem;
        margin-right: 1.2rem;
        height: 1.8rem;
        width: 1.8rem;
    }

    &:hover {
        color: var(--color-accent);
        fill: var(--color-accent);
        box-shadow:  7px  7px 20px #bebebe,
                    -9px -9px 20px #ffffff;
    }
}
</style>