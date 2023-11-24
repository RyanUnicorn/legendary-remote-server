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
  grid-template-rows: repeat(2, calc((100vh - var(--spacing-const) * 5) / 2));
  gap: var(--spacing-const);
}
</style>