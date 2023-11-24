<script setup>
  import { ref } from 'vue';
  import EditableTextInline from '../../shared/EditableTextInline.vue';

  const props = defineProps({
    modelValue: Object,
  });

  const emit = defineEmits([
    'update:modelValue',
  ]);

  const settings = ref(props.modelValue);

  function handleDelete(ind) {
    if(settings.value.options.length > 1) {
      settings.value.options.splice(ind, 1);
    } else {
      alert('At least one option is needed!');
    }
  }

</script>

<template>
  <div class="new-select">
    <label class="options-title">Options</label>
    <div class="option-list">
      <div class="option-list-element"
        v-for="(option, ind) in settings.options"
      >
        <EditableTextInline
          :text="option"
          @rename="(name) => settings.options[ind] = name"
        />
        <a class="delete-option-btn"
          @click="handleDelete(ind)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="0.8em" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
        </a>
      </div>
    </div>
    <button class="neu-box option-create-btn"
      @click="settings.options.push(`option${settings.options.length + 1}`)"
    >
      NEW OPTION
    </button>
  </div>
</template>

<style scoped>
  .option-create-btn {
    position: absolute;
    bottom: calc(1 * var(--spacing-const));
    left: 0;

    border: none;
    background-color: var(--color-background);
    padding-inline: 1rem;
    padding-block: 1rem;

    font-size: 1rem;
    font-weight: bolder;
    color: var(--color-accent);

    transition: 200ms;
    &:hover {
      cursor: pointer;
      box-shadow:  7px  7px 20px #bebebe,
                    -9px -9px 20px #ffffff;
    }
  }

  .delete-option-btn {
    cursor: pointer;

    position: relative;
    bottom: 1px;
    padding-left: 0.5rem;
    fill: var(--color-accent);

    transition: 200ms;

    &:hover {
      transform: scale(1.1);
    }
  }

  .option-list-element {
    flex-basis: 30%;
    height: fit-content;

    display: flex;
    font-size: 1.2rem;
  }

  @media(max-width: 1500px) {
    .option-list-element {
      flex-basis: 40%;
    }
  }

  .option-list {
    display: flex;
    flex-wrap: wrap;
    /* grid-template-columns: repeat(2, 1fr); */
    gap: 1rem;

    overflow: visible;
    overflow-y: auto;

    height: fit-content;
    padding-bottom: 0.1rem;

    &::-webkit-scrollbar {
      width: 1rem;
    }
    &::-webkit-scrollbar-track {
      border-radius: var(--border-radius);
      margin: 0.5rem;
    }
    &::-webkit-scrollbar-thumb {
      border: 0.4rem solid var(--color-background);
      border-radius: var(--border-radius);
      background: var(--color-text-mute);
    }
  }

  .options-title {
    font-size: 1.1rem;
    color: var(--color-text-mute);
    z-index: 1;
  }

  .new-select {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100%; /* ??????????????????? */
    max-height: 0px;  /* ??????????????????? */
    padding-bottom: 8rem;
  }
</style>