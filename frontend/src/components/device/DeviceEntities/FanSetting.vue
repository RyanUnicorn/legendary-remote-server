<script setup>
  import { computed, ref } from 'vue';
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

  const presetModesValue = computed(() => {
    return settings.value.presetModes.join(',');
  })

  function handlePresetModeChange(wut) {
    if(wut == '') {
      settings.value.presetModes = ['Normal'];
    } else {
      settings.value.presetModes = wut.split(',');
      settings.value.presetModes.filter((value) => value != '');
    }
    updateModel();
  }

</script>

<template>
  <div class="new-fan-wrapper">
    <div class="new-fan-form-element">
      <label>Enable Direction</label>
      <CheckBox style="font-size: 1.2rem;"
        :model-value="settings.enableDirection"
        @update:model-value="(value) => { settings.enableDirection = value; updateModel(); }"
      />
    </div>
    <div class="new-fan-form-element">
      <label>Enable Oscillation</label>
      <CheckBox style="font-size: 1.2rem;"
        :model-value="settings.enableOscillation"
        @update:model-value="(value) => { settings.enableOscillation = value; updateModel(); }"
      />
    </div>
    <div class="new-fan-form-element">
      <label>Enable Percentage</label>
      <CheckBox style="font-size: 1.2rem;"
        :model-value="settings.enablePercentage"
        @update:model-value="(value) => { settings.enablePercentage = value; updateModel(); }"
      />
    </div>
    <div class="new-fan-form-element">
      <label>Enable PresetMode</label>
      <CheckBox style="font-size: 1.2rem;"
        :model-value="settings.enablePresetMode"
        @update:model-value="(value) => { settings.enablePresetMode = value; updateModel(); }"
      />
    </div>
    <div v-if="settings.enablePercentage" class="new-fan-form-element">
      <label>Speed Range Max</label>
      <input type="number" class="neu-box"
        v-model="settings.speedRangeMax"
        @change="(event) => { settings.speedRangeMax = event.target.value; updateModel(); }"
      >
    </div>
    <div v-if="settings.enablePresetMode" class="new-fan-form-element">
      <label>Preset Modes (separated by comma)</label>
      <input type="text" class="neu-box"
        :value="presetModesValue"
        @change="(event) => handlePresetModeChange(event.target.value)"
      >
    </div>
  </div>
</template>

<style>
  .new-fan-form-element {
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

    & input[type="text"]{
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

  .new-fan-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-const);
  }
</style>