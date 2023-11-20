<script setup>
  import { ref } from 'vue';
  import AvailableBoardCard from './AvailableBoardCard.vue';

  const props = defineProps([
    'boards',
  ])

  const emit = defineEmits([
    'pair' // pair(id)
  ])

</script>

<template>
  <div class="available-boards-wrapper">
    <div class="board-card-wrapper">
      <AvailableBoardCard v-for="board in boards" :key="board.id"
        :board-data="board"
        @pair="(id) => $emit('pair', id)"
      />
    </div>
    <h2>Available Boards</h2>
  </div>    
</template>

<style scoped>

  .board-card-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius);

    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: var(--spacing-const);

    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: calc(1.5 * var(--spacing-const));
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

    padding: 2rem;
    padding-top: 7rem;

  }

  .available-boards-wrapper::before {
    position: absolute;
    width: 100%;
    height: 70%;
    bottom: 2rem;
    pointer-events: none;

    border-radius: var(--border-radius);
    content: '';
    z-index: 1;
    background: linear-gradient(to  left, transparent 98%, var(--color-background) 99.5%, var(--color-background)),
                linear-gradient(to right, transparent 98%, var(--color-background) 99.5%, var(--color-background));
  }
  .available-boards-wrapper {
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
    }
  }
</style>