<script setup>
  import EntityCard from './EntityCard.vue';

  const emit = defineEmits([
    'newEntity', // newEntity()
    'renameEntity', // renameEntity(id, name)
    'deleteEntity', // deleteEntity(id)
  ]);

  const props = defineProps({
    entities: Array,
  });

</script>

<template>
  <div class="entity-list-wrapper">
    <h2>Entities</h2>
    <div class="device-entities">
      <EntityCard
        v-for="entity in entities"
        :key="entity.id"
        :entity-info="entity"
        @rename-entity="(id, name) => $emit('renameEntity', id, name)"
        @delete-entity="(id) => $emit('deleteEntity', id)"
      />
      <a class="neu-box entity-new-btn"
        @click="$emit('newEntity')"
      >
        <svg class="w-6 h-6 text-gray-800 dark:text-white" style="padding: 1.4rem;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/></svg>
      </a>
    </div>
  </div>
</template>

<style scoped>

  .entity-new-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 5.9rem;

    transition: 200ms;
    & svg {
      height: 5rem;
      color: var(--color-text-mute);
      transition: 200ms;
    }

    &:hover {
      cursor: pointer;
      box-shadow:  7px  7px 20px #bebebe,
                    -9px -9px 20px #ffffff;

      & svg {
        color: var(--color-accent);
      }
    }
  }

  .device-entities {
    position: absolute;
    width: 100%;
    height: 100%;

    border-radius: var(--border-radius);
    padding: var(--spacing-const);
    padding-top: 6rem;

    display: flex;
    flex-direction: column;
    gap: var(--spacing-const);

    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scroll-padding: 6rem;

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

  .entity-list-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius);

    & h2 {
      position: absolute;
      top: 1.2rem;
      left: 2rem;

      font-size: 1.6rem;
      font-weight: bold;
      color: var(--color-text-mute);

      z-index: 2;
    }

    &::before {
      position: absolute;
      width: 98%;
      height: 100%;
      pointer-events: none;

      border-radius: var(--border-radius);
      content: '';
      z-index: 1;
      background: linear-gradient(to  top, transparent 86%, var(--color-background) 90%, var(--color-background)),
                  linear-gradient(to bottom, transparent 97%, var(--color-background) 99.5%, var(--color-background));
    }
  }
</style>