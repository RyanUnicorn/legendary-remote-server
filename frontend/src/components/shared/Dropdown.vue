<script setup>
/**
 * This is a drop down component, pass in the 'options' prop e.g. ['Rename', 'Edit', 'Delete']
 * to define the options in the dropdown, when somthing in the drop down is clicked
 * the component will emit a selected event with one arg, the selected button's text
 * If using the above example options, and the user selected the 'Edit' option 
 * then it'll emit: selected('Edit')
 */

import { computed, nextTick, ref } from 'vue';


const props = defineProps([
  'options',
])

const emits = defineEmits([
  'selected',
])

const height = computed(() => {
  return `calc(1rem + ${ 2.3*props.options.length }rem)`;
})

const isFocused = ref(false);

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false
  }, 50);
};

</script>

<template>
    <div class="dropdown">
      <button @click="isFocused=!isFocused" @blur="handleBlur" class="icon-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
      </button>
      <div :class="{'show-dropdown': isFocused}"  class="dropdown-options neu-box">
        <div @click="$emit('selected', opt)" v-for="opt in props.options">
          {{ opt }}
        </div>
      </div>
    </div>
</template>

<style scoped>

  .dropdown-options {
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
    width: fit-content;

    display: flex;
    flex-direction: column;
    
    background-color: var(--color-background);
    box-shadow: none;
    padding-inline: 1rem;
    opacity: 0;
    
    overflow: hidden;
    max-height: 0;
    min-height: 0;
    transition: 100ms ease-in-out;
    & div {
      color: var(--color-text);
      font-size: 1rem;
      padding: 0.3rem;
      border-radius: calc(var(--border-radius) / 2);

      transition: 200ms;
      &:hover {
        color: var(--color-accent);
        cursor: pointer;
      }
    }
  }

  .show-dropdown {
    opacity: 100%;
    max-height: 100%;
    min-height: v-bind(height);
    padding-block: 0.5rem;
    box-shadow:  5px  5px 16px #bebebe,
              -5px -5px 16px #ffffff;
  }

  .icon-button {
    background: none;
    border: none;


    &:hover {
      cursor: pointer;
    }

    & svg {
      width: var(--spacing-const);
      height: var(--spacing-const);
      fill: var(--color-text);
    }
  }
</style>