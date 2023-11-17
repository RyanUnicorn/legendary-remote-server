<script setup>
import { RouterLink } from 'vue-router'
import OverviewDevicesAddingCard from './OverviewDevicesAddingCard.vue';
import OverviewDevicesInfoCard from './OverviewDevicesInfoCard.vue';

  const mockData = [
    { id:  1, name: 'Item  1', enableUpdate: false, Entities: 3 },
    { id:  2, name: 'Item  2', enableUpdate:  true, Entities: 7 },
    { id:  3, name: 'Item  3', enableUpdate: false, Entities: 5 },
  ];
</script>



<template>
  <div class="neu-box fram">
    <h3>Devices</h3>
    <div class="container">
      <RouterLink v-for="data in mockData" :key="data.id" :to="`/devices/${data.id}`">
        <OverviewDevicesInfoCard :deviceName="data.name" :entities="data.Entities" :enableUpdate="data.enableUpdate"></OverviewDevicesInfoCard>
      </RouterLink>
      <RouterLink to = "/devices">
        <OverviewDevicesAddingCard>
          <svg class="w-6 h-6 text-gray-800 dark:text-white" style="padding: 1.4rem;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/></svg>
        </OverviewDevicesAddingCard>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>

.fram {
  padding-top: 24px;
  padding-left: 24px;
  min-height: 380px;
  & h3{
    font-weight: bolder;
    font-size: 1.5rem;
    color: var(--color-text-mute  );
  }
}
.container {
  display: flex;
  max-width: calc(100% - 24px);
  height: 350px;
  padding-top: 30px;
  padding-left: 24px;
  padding-right: 24px;
  flex-wrap: wrap;
  gap: 24px;
  align-content: flex-start;
  flex-direction: column;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 13px;
  overflow-x: auto;
}

.container::-webkit-scrollbar {
  width: 0;
}

.container::-webkit-scrollbar-track {
  display: none;
}

.container::-webkit-scrollbar-thumb {
  display: none;
}

</style>