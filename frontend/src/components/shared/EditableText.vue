<script setup>
import { nextTick, ref, watchEffect } from 'vue';

  /**
   * This is a editable text componet, the passed in prop 'text' means the text being 
   * displayed and the passed in 'editing' prop is a boolean whitch indicates if the
   *  text is being editing, after the editing is done (user pressed enter, or esc
   *  to discard changes) this component will emit a 'finish' event with 
   * finish(bool edited, string content), bool edited is true when the user save it's
   *  changes, false when the user discard the changes, and the text is the content
   * that's been modified.
   */

  const props = defineProps([
    'text',
    'editing'
  ]);
  const emits = defineEmits([
    'finish'
  ])

  const textInput = ref(null);
  const myText = ref(props.text);

  watchEffect(async () => {
    if(props.editing) {
      await nextTick();
      textInput.value.focus();
    } else {
      myText.value = props.text;
    }
  });

</script>

<template>
  <form
    @submit.prevent="$emit('finish', true, myText)"
    @keyup.esc="$emit('finish', false, '')"
  >
    <input ref="textInput" @blur="$emit('finish', false, '')" class="editable-text" :class="{editing: editing}" type="text" v-model="myText" :disabled="!editing">
  </form>
</template>

<style scoped>
  .editable-text {
    background: none;
    border: none;
    color: var(--color-text);
    font-size: 1em;
    font-weight: inherit;
    padding: 0;
    width: 10rem;

    &:disabled {
      color: var(--color-text);
      cursor: text;
    }

    &:focus {
      border-radius: 5px;
      outline: var(--color-accent-mute) solid 2px;
      outline-offset: 3px;
    }
  }

</style>