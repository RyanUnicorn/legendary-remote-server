<script setup>
  import { ref } from 'vue';
  import DropDown from '../../shared/DropDown.vue';
  import EditableText from '../../shared/EditableText.vue';
  const options = ['Rename', 'Unpair'];

  const props = defineProps([
    'boardData',
  ]);
  const emit = defineEmits([
    'unpair', // uppair(id)
    'rename', // rename(id, name)
  ])

  const editing = ref(false);

  function handleSelected(option) {
    switch(option) {
      case 'Rename':
        editing.value = true;
        break;
      case 'Unpair':
        emit('unpair', props.boardData?.id);
        break;
    }
  }

  function handleEdit(edited, content) {
    if(edited) {
      emit('rename', props.boardData?.id, content);
    }
    editing.value = false;
  }

</script>

<template>
   <div class="paired-board-card neu-box">
    <DropDown class="card-dropdown"
      :options="options"
      @selected="handleSelected"
    />
    <EditableText
      :text="boardData?.name"
      :editing="editing"
      @finish="handleEdit"
    />
    <h1>{{ boardData?.id.match(/.{1,2}/g).join(':') }}</h1>
    <p :class="{offline: !boardData?.isAvailable}">
      {{ boardData?.isAvailable? 'Online' : 'Offline' }}
    </p>
   </div>
</template>

<style scoped>
  .paired-board-card {
    position: relative;
    scroll-snap-align: start;
    padding-block: 0.8rem;
    padding-inline: 1.5rem;
    width: 15rem;
    flex-basis: 45%;

    font-size: 1.3rem;
    color: var(--color-text);
    
    & h1 {
      position: relative;
      top: -0.3rem;
      font-size: 0.9rem;
      color: var(--color-text-mute);
    }

    & p {
      padding-inline: 0.8rem;
      border-radius: 1rem;
      position: absolute;
      bottom: 1rem;

      font-size: 0.9rem;
      
      background-color: var(--color-accent-mute);
      color: var(--color-accent);

      &.offline {
        background-color: var(--color-background-mute);
        color: var(--color-text);
      }
    }

  }

  @media(max-height: 930px) {
    .paired-board-card {
      flex-basis: 43%;
      
      & h1 {
        height: 0;
        overflow: hidden;
      }
    }
  }

  @media(max-height: 820px) {
    .paired-board-card {
      flex-basis: 90%;
      & h1 {
        height: auto;
        overflow: hidden;
      }
    }
  }

  .card-dropdown {
    top: 1rem;
    right: 0.5rem;
    position: absolute;
  }
</style>