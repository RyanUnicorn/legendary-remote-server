<script setup>
  import { ref } from 'vue';
  import List from './DeviceEntities/List.vue';
  import NewEntity from './DeviceEntities/NewEntity.vue';

  const emit = defineEmits([
    'renameEntity', // renameEntity(id, name)
    'deleteEntity', // deleteEntity(id)
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
    />
  </div>
</template>

<style scoped>

</style>