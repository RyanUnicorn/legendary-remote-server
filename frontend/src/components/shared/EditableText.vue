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
    'finish', // finish(bool edited, string content)
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
  <div class="editable-text-wrapper">

    <div v-if="!editing" class="editable-text-text">
      {{ myText }}
    </div>

    <input type="text"
      v-if="editing"
      class="editable-text-input"
      ref="textInput"
      v-model="myText"
      @keyup.enter="$emit('finish', true, myText)"
      @blur="$emit('finish', false, '')" 
      @keyup.esc="$emit('finish', false, '')"
    >
  </div>
</template>

<style scoped>
  .editable-text-wrapper {
    width: fit-content;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
  }

  .editable-text-text {
    width: fit-content;
    color: inherit;
    font-size: 1em;
    font-weight: inherit;
  }

  .editable-text-input {
    background: none;
    border: none;
    color: inherit;
    font-size: 1em;
    font-weight: inherit;
    padding: 0;
    width: 10em;

    &:focus {
      border-radius: 5px;
      outline: var(--color-accent-mute) solid 2px;
      outline-offset: 3px;
    }
  }

</style>