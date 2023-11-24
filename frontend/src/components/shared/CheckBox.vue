<script setup>
  import { onMounted, ref, watchEffect } from 'vue';

  const props = defineProps({
    modelValue: Boolean,
  }); 

  const emit = defineEmits([
    'update:modelValue'
  ]);

  const checked = ref(props.modelValue || false);

  function handleClick() {
    checked.value = !checked.value;
    emit('update:modelValue', checked.value);
  }

  onMounted(() => {
    watchEffect(() => {
      checked.value = props.modelValue;
    });
  })

</script>

<template>
  <button @click="handleClick" class="checkbox" :class="{ 'checkbox-checked': checked }"></button>
</template>

<style>
  .checkbox {
    /* position: absolute; */
    border: none;
    --checkbox-size: 1.5em;
    width: calc(2 * var(--checkbox-size));
    height: calc(1 * var(--checkbox-size));
    padding: 0;
    background-color: var(--color-background-mute);
    border-radius: calc(var(--checkbox-size) / 2);

    transition: 200ms;

    &:hover {
      cursor: pointer;
    }

    &:focus {
      outline: none;
    }

    &.checkbox-checked {
      background-color: var(--color-accent-mute);
    }

    &::before {
      content: '';
      display: block;
      position: relative;
      width: calc(1 * var(--checkbox-size));
      height: calc(1 * var(--checkbox-size));
      left: 0;
      background-color: var(--color-accent);
      border-radius: calc(var(--checkbox-size) / 2);

      transition: 150ms;
    }

    &.checkbox-checked::before {
      left: calc(1 * var(--checkbox-size));
    } 
  }

</style>