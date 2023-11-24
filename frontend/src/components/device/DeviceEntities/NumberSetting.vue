<script setup>
  import { ref, watch, watchEffect } from 'vue';
  import CheckBox from '../../shared/CheckBox.vue';

  const props = defineProps({
    modelValue: Object,
  });

  const emit = defineEmits([
    'update:modelValue', 
  ]);

  const settings = ref(props.modelValue);
  
  function updateModel() {
    emit('update:modelValue', settings.value);
  }

</script>

<template>
  <div class="new-number-wrapper">
    <div class="new-number-form-element">
      <label>Is Slider</label>
      <CheckBox style="font-size: 1.2rem;"
        :model-value="settings.isSlider"
        @update:model-value="(value) => { settings.isSlider = value; updateModel(); }"
      />
    </div>
    <div class="new-number-form-element">
      <label>Step</label>
      <input class="neu-box" type="number" min="0" max="1" step="0.01"
        v-model="settings.step"
        @change="updateModel"
      />
    </div>
    <div class="new-number-form-element">
      <label>Min Number</label>
      <input class="neu-box" type="number" min="0" :max="settings.max"
        v-model="settings.min"
        @change="updateModel"
      />
    </div>
    <div class="new-number-form-element">
      <label>Max Number</label>
      <input class="neu-box" type="number" :min="settings.min"
        v-model="settings.max"
        @change="updateModel"
      />
    </div>
  </div>
</template>

<style scoped>

  .new-number-form-element {
    flex-basis: 40%;
    flex-grow: 1;

    display: flex;
    flex-direction: column;

    & label {
      z-index: 1;
      padding-bottom: 0.3rem;
      font-size: 1.1rem;
      color: var(--color-text-mute);
    }

    & input[type="number"]{
      width: 90%;
      background-color: var(--color-background);
      border: none;
      padding: 0.8rem;
      
      font-size: 1rem;
      color: var(--color-text);

      &:focus {
        outline: var(--color-accent-mute) solid 3px;
      }
    }
  }

  .new-number-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-const);
  }

</style>