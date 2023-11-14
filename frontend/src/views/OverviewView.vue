<script setup>
  import OverviewDevices from '../components/overview/OverviewDevices.vue';
  import OverviewBoards from '../components/overview/OverviewBoards.vue';
</script>

<template>
  <div class="overview-grid">
    <OverviewDevices/>
    <OverviewBoards/>
  </div>
</template>

<style scoped>
.overview-grid {
  /* padding: 0; */
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: var(--spacing-const);
}
</style>