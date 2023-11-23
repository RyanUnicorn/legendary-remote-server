<script setup>
  import { ref } from 'vue';
import DropDown from '../../shared/DropDown.vue';
  import EditableText from '../../shared/EditableText.vue';

  const props = defineProps({
    entityInfo: Object,
  });

  const emit = defineEmits([
    'renameEntity', // renameEntity(id, name)
    'deleteEntity', // deleteEntity(id)
  ]);

  const options = [
    'Rename',
    'Delete',
  ];

  const editing = ref(false);

  function handleSelected(option) {
    switch (option) {
      case 'Rename':
        editing.value = true;
        break;
      case 'Delete':
        const result = confirm('Are you sure you want to delete this entity?\nThis CANNOT be undo!');
        if(result){
          emit('deleteEntity', props.entityInfo.id)
        }
        break;
    }
  }

  function handleRename(edited, name) {
    if(edited) {
      emit('renameEntity', props.entityInfo.id, name);
    }
    editing.value = false;
  }

  function deviceType() {
    const deviceType = props.entityInfo.type.charAt(0).toUpperCase() + props.entityInfo.type.slice(1);
    return deviceType;
  }

</script>

<template>
  <div class="neu-box entity-card">
    <EditableText class="entity-card-name"
      :text="entityInfo.name"
      :editing="editing"
      :adaptive-width="true"
      @finish="handleRename"
    />
    <span>{{  deviceType()  }}</span>
    <DropDown class="entity-dropdown"
      :options="options"
      @selected="handleSelected"
    />
  </div>
</template>

<style scoped>
  .entity-dropdown {
    position: absolute;
    top: 1.5rem;
    right: 1rem;
  }

  .entity-card {
    position: relative;

    padding-inline: 1.5rem;
    padding-block: 1rem;
    scroll-snap-align: start;

    & span {
      color: var(--color-text-mute);
    }
  }

  .entity-card-name {
    font-size: 1.5rem;
    color: var(--color-text);
  }

</style>