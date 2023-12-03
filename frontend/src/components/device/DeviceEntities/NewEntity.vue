<script setup>
  import { ref, watch } from 'vue';
  import EditableTextInline from '../../shared/EditableTextInline.vue';
  import NumberSetting from './NumberSetting.vue';
  import SelectSetting from './SelectSetting.vue';
  import FanSetting from './FanSetting.vue';

  const emit = defineEmits([
    'cancel', // cancel()
    'newNumber', // newNumber(entityName, {min, max, step, isSlide})
    'newSelect', // newSelect(entityName, {options:[...]})
    'newButton', // newButton(entityName)
    'newSwitch', // newSwitch(entityName)
    'newFan',    // newFan(entityName, {flags..., consts...})
  ]);

  const entityType = ref('switch');

  const entityName = ref('New Entity')
  const numberSettings = ref({
    isSlider: true,
    min: 1,
    max: 100,
    step: 1,
  });
  const selectSettings = ref({
    options: [
      'option1',
      'option2',
      'option3',
    ],
  });
  const fanSettings = ref({
    enableDirection: false,
    enableOscillation: false,
    enablePercentage: false,
    enablePresetMode: false,
    speedRangeMax: 100,
    presetModes: [
      'Normal',
      'Eco',
      'Turbo',
    ],
  });

  // setInterval(() => {
  //   console.log(fanSettings.value);
  // }, 1000);

  function newNumber() {
    emit('newNumber', entityName.value, numberSettings.value);
  }

  function newSelect() {
    emit('newSelect', entityName.value, selectSettings.value);
  }
  
  function newButton() {
    emit('newButton', entityName.value);
  }

  function newSwitch() {
    emit('newSwitch', entityName.value);
  }

  function newFan() {
    const fanSettingSanitized = {
      enableDirection: fanSettings.value.enableDirection,
      enableOscillation: fanSettings.value.enableOscillation,
      enablePercentage: fanSettings.value.enablePercentage,
      enablePresetMode: fanSettings.value.enablePresetMode,
    };
    
    if(fanSettings.value.enablePercentage) {
      fanSettingSanitized.speedRangeMax = fanSettings.value.speedRangeMax;
    }

    if(fanSettings.value.enablePresetMode) {
      fanSettingSanitized.presetModes = fanSettings.value.presetModes;
    }

    emit('newFan', entityName.value, fanSettingSanitized);
  }

  function handleCreateEntity() {
    switch(entityType.value) {
      case 'number':
        newNumber();
        break;
      case 'select':
        newSelect();
        break;
      case 'button':
        newButton();
        break;
      case 'switch':
        newSwitch();
        break;
      case 'fan':
        newFan();
        break;
    }
  }

</script>

<template>
  <div class="new-entity-wrapper">
    <a @click="$emit('cancel')">&lt Back</a>
    <div class="new-entity">
      <div class="entity-title-wrapper">
        <div>
          <EditableTextInline class="form-element form-entity-name"
            :text="entityName"
            @rename="(name) => entityName = name"
          />
        </div>
        <div class="entity-type-wrapper">
          <label>Entity Type</label>
          <select v-model="entityType">
            <option value="switch">Switch</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
            <option value="button">Button</option>
            <option value="fan">Fan</option>
          </select>
        </div>
      </div>
      <div class="entity-setting-wrapper">
        <h2>Additional Settings</h2>
        <NumberSetting
          v-if="entityType == 'number'"
          v-model="numberSettings"
        />
        <SelectSetting
          v-if="entityType == 'select'"
          v-model="selectSettings"
        />
        <FanSetting
          v-if="entityType == 'fan'"
          v-model="fanSettings"
        />
        <div v-if="entityType == 'switch' || entityType == 'button'"
          style="display: flex; justify-content: center; color: var(--color-text-mute); font-size: 2rem; padding-top: 5rem;"
        >
        NONE
        </div>
      </div>
      <button class="neu-box entity-create-btn"
        @click="handleCreateEntity"
      >
      CREATE
      </button>
    </div>
  </div>
</template>

<style scoped>

  .entity-create-btn {
    position: absolute;
    bottom: calc(1 * var(--spacing-const));
    right: calc(2 * var(--spacing-const));

    border: none;
    background-color: var(--color-background);
    padding-inline: 1.2rem;
    padding-block: 0.8rem;
    color: var(--color-accent);
    font-weight: bolder;
    font-size: 1rem;

    transition: 200ms;
    &:hover {
      cursor: pointer;
      box-shadow:  7px  7px 20px #bebebe,
                    -9px -9px 20px #ffffff;
    }
  }

  .entity-setting-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    & h2 {
      font-weight: bolder;
      color: var(--color-accent);
      padding-bottom: 1rem;
    }
  }

  .entity-type-wrapper {
    position: absolute;
    right: 3rem;
    top: 0;

    display: flex;
    flex-direction: column;

    & label {
      padding-bottom: 0.3rem;
      color: var(--color-text);
      z-index: 1;
    }
  }

  .entity-title-wrapper {
    position: relative;
    padding-bottom: 1.5rem;
  }

  .form-entity-name {
    font-size: 1.8rem;
    color: var(--color-text);
  }

  .form-element {
    flex-grow: 1;
    flex-basis: 0px;
  }

  .new-entity {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .new-entity-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    
    border-radius: var(--border-radius);

    padding: 3rem;
    padding-top: 4rem;

    & a {
      position: absolute;
      top: 1.2rem;
      left: 2rem;

      cursor: pointer;
      font-size: 1.6rem;
      font-weight: bold;
      color: var(--color-accent);
    }
  }
</style>