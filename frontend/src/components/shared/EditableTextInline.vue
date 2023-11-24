<script setup>
  import { ref } from 'vue';
  import EditableText from './EditableText.vue';

  const props = defineProps({
    text: String,
  })

  const emit = defineEmits([
    'rename', // rename(string name)
  ]);

  const editing = ref(false);

  function handleFinish(edited, content) {
    if(edited) {
      emit('rename', content);
    }
    editing.value = false;
  }

</script>

<template>
  <div class="editable-text-inline-wrapper">
    <EditableText
      :editing="editing"
      :text="text"
      :adaptiveWidth="true"
      @finish="handleFinish"
    />
    <button class="icon-btn"
      v-if="!editing"
      @click="editing = true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
    </button>
  </div>
</template>

<style scoped>
  .editable-text-inline-wrapper {
    display: flex;
    /* align-items: center; */
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    gap: 0.5em;
  }

  .icon-btn {
    background-color: transparent;
    border: none;
    transition: 200ms;
    font-size: inherit;
    padding: 0;
    & svg {
      height: 0.8em;
      fill: var(--color-accent);
    }
    &:hover {
      cursor: pointer;
      transform: scale(1.1);
    }
  }
</style>