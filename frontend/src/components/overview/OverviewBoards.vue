<script setup>
  import PairedBoards from './OverviewBoards/PairedBoards.vue';
  import AvailableBoards from './OverviewBoards/AvailableBoards.vue';
  import { onMounted, ref } from 'vue';
  import { globals } from '../../main';
  import axios from 'axios';

  const pairedBoards = ref([]);
  const availableBoards = ref([]);

  async function fetchPairedBoards() {
    /**
     * * GET /api/boards
     */

    try {
      let result = await axios.get(`${globals.$origin}/api/boards`);
      pairedBoards.value = result.data;
    } catch(err){
      console.error(err);
    }
  }

  async function fetchAvailableBoards() {
    /**
     * * GET /api/boards/discover
     */

    try {
      const result = await axios.get(`${globals.$origin}/api/boards/discover`);
      let resultAvailable = result.data.filter((board) => board.isAvailable);
      
      pairedBoards.value.forEach((paired) => {
        resultAvailable = resultAvailable.filter((available) => available.id != paired.id);
      });
      availableBoards.value = resultAvailable;

    } catch(err){
      console.error(err);
    }
  }

  async function handlePair(id) {
    /**
     * * POST /api/boards
     */

    try {
      await axios.post(`${globals.$origin}/api/boards`, {
        id,
        name: 'New Board',
      });
    } catch(err){
      console.error(err);
    }

    await fetchPairedBoards();
    await fetchAvailableBoards();
  }

  async function handleRename(id, name) {
    /**
     * * PUT /api/boards/{boardId}
     */

    try {
      await axios.put(`${globals.$origin}/api/boards/${id}`, {
        name,
      });
    } catch (err) {
      console.error(err);
    }

    fetchPairedBoards();
  }

  async function handleUnpair(id) {
    /**
     * * DELETE /api/boards/{boardId}
     */

    try {
      await axios.delete(`${globals.$origin}/api/boards/${id}`);
    } catch (err) {
      console.error(err);
    }

    await fetchPairedBoards();
    await fetchAvailableBoards();
  }

  onMounted(async () => {
    await fetchPairedBoards();
    await fetchAvailableBoards();
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