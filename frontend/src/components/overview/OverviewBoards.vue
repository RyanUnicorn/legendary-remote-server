<script setup>
  import PairedBoards from './OverviewBoards/PairedBoards.vue';
  import AvailableBoards from './OverviewBoards/AvailableBoards.vue';
  import { onMounted, ref } from 'vue';

  const pairedBoards = ref([]);
  const availableBoards = ref([]);

  function fetchPairedBoards() {
    /**
     * TODO: api call to fetch the paired boards
     */
    pairedBoards.value = [
      {
        id: '123456789ABC',
        name: 'Bedroom',
        online: true,
      },
      {
        id: '23456789ABCD',
        name: 'Living room',
        online: false,
      },
      {
        id: '3456789ABCDE',
        name: 'Bathroom',
        online: true,
      },
      {
        id: '456789ABCDEF',
        name: 'Bedroom',
        online: true,
      },
      {
        id: '56789ABCDEF1',
        name: 'Living room',
        online: true,
      },
      {
        id: '6789ABCDEF12',
        name: 'Bathroom',
        online: true,
      },
      {
        id: '789ABCDEF123',
        name: 'Bedroom',
        online: true,
      },
      {
        id: '89ABCDEF1234',
        name: 'Living room',
        online: true,
      },
      {
        id: '9ABCDEF12345',
        name: 'Bathroom',
        online: true,
      },
    ];
  }

  function fetchAvailableBoards() {
    /**
     * TODO: api call to fetch the available boards
     */
    availableBoards.value = [
      {
        id: '123456789ABC'
      },
      {
        id: '23456789ABCD'
      },
      {
        id: '3456789ABCDE'
      },
      {
        id: '456789ABCDEF'
      },
      {
        id: '56789ABCDEF1'
      },
      {
        id: '6789ABCDEF12'
      },
      {
        id: '789ABCDEF123'
      },
      {
        id: '89ABCDEF1234'
      },
      {
        id: '9ABCDEF12345'
      }
    ];
  }

  function handlePair(id) {
    console.log('pairing', id);
    /**
     * TODO: api call to pair the board
     */
    fetchPairedBoards();
    fetchAvailableBoards();
  }

  function handleRename(id, name) {
    console.log('renaming', id, 'to', name);
    /**
     * TODO: api call to rename the board
     */
    fetchPairedBoards();
  }

  function handleUnpair(id) {
    console.log('unpairing', id);
    /**
     * TODO: api call to unpair the board
     */
    fetchPairedBoards();
    fetchAvailableBoards();
  }

  onMounted(() => {
    fetchPairedBoards();
    fetchAvailableBoards();
  });

</script>

<template>
  <div class="paired-board-grid">
    <div class="neu-box">
      <PairedBoards 
        :boards="pairedBoards"
        @rename="handleRename"
        @unpair="handleUnpair"
      />
    </div>
    <div class="neu-box">
      <AvailableBoards
        :boards="availableBoards"
        @pair="handlePair"
      />
    </div>
  </div>
</template>

<style scoped>
  .paired-board-grid {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - var(--spacing-const) / 2));
    gap: var(--spacing-const);
  }
</style>