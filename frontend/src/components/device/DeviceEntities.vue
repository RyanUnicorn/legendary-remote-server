<script setup>
  import { ref } from 'vue';
  import List from './DeviceEntities/List.vue';
  import NewEntity from './DeviceEntities/NewEntity.vue';

  const emit = defineEmits([
    'renameEntity', // renameEntity(id, name)
    'deleteEntity', // deleteEntity(id)
    'newNumber', // newNumber(entityName, {min, max, step, isSlide})
    'newSelect', // newSelect(entityName, {options:[...]})
    'newButton', // newButton(entityName)
    'newSwitch', // newSwitch(entityName)
  ]);

  const props = defineProps({
    entities: Array,
  });

  const listing = ref(true);

  function handleNewEntity() {
    listing.value = false;
  }

  function handleNewEntityCancel() {
    listing.value = true;
  }

</script>

<template>
  <div class="neu-box">
    <List
      :entities="entities"
      v-if="listing"
      @new-entity="handleNewEntity"
      @rename-entity="(id, name) => $emit('renameEntity', id, name)"
      @delete-entity="(id) => $emit('deleteEntity', id)"
    />
    <NewEntity
      v-if="!listing"
      @cancel="handleNewEntityCancel"
      @new-number="(entityName, settings) => { $emit('newNumber', entityName, settings); listing = true; }"
      @new-select="(entityName, settings) => { $emit('newSelect', entityName, settings); listing = true; }"
      @new-button="(entityName) => { $emit('newButton', entityName); listing = true; }"
      @new-switch="(entityName) => { $emit('newSwitch', entityName); listing = true; }"
    />
  </div>
</template>

<style scoped>

</style>