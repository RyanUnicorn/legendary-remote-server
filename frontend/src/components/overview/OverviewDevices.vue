<script setup>
  import { RouterLink } from 'vue-router'
  import OverviewDevicesAddingCard from './OverviewDevices/OverviewDevicesAddingCard.vue';
  import OverviewDevicesInfoCard from './OverviewDevices/OverviewDevicesInfoCard.vue';
  import { onMounted, ref } from 'vue';

  const devices = ref([]);

  function fetchDevices(){
    devices.value = [
      {
        id: 1,
        name: "Item 1",
        enableUpdate: true,
        entityCount: 3
      },
      {
        id: 2,
        name: "Item 2",
        enableUpdate: false,
        entityCount: 6
      },
      {
        id: 3,
        name: "Item 3",
        enableUpdate: true,
        entityCount: 3
      },
      {
        id: 4,
        name: "Item 4",
        enableUpdate: true,
        entityCount: 1
      },
      {
        id: 5,
        name: "Item 5",
        enableUpdate: false,
        entityCount: 3
      },
      {
        id: 6,
        name: "Item 6",
        enableUpdate: false,
        entityCount: 3
      },
      {
        id: 7,
        name: "Item 7",
        enableUpdate: true,
        entityCount: 7
      },
      {
        id: 8,
        name: "Item 8",
        enableUpdate: true,
        entityCount: 8
      },
      {
        id: 9,
        name: "Item 9",
        enableUpdate: true,
        entityCount: 9
      },
      {
        id: 10,
        name: "Item 10",
        enableUpdate: false,
        entityCount: 30
      },
    ]
  }

  onMounted(() => {
    fetchDevices();
  });
</script>



<template>
  <div class="neu-box frame">
    <h3>Devices</h3>
    <div class="container">
      <RouterLink v-for="data in devices" :key="data.id" :to="`/devices/${data.id}`">
        <OverviewDevicesInfoCard :deviceName="data.name" :entities="data.entityCount" :enableUpdate="data.enableUpdate"></OverviewDevicesInfoCard>
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

.frame {
  position: relative;
  height: 100%;
  & h3{
    position: absolute;
    top: 1.2rem;
    left: 2rem;
    font-weight: bold;
    font-size: 1.5rem;
    color: var(--color-text-mute  );
  }
}
.container {
  position: absolute;
  
  display: flex;
  height: 100%;
  width: 100%;
  padding-top: 24px;
  padding-bottom: 24px;
  flex-wrap: wrap;
  gap: var(--spacing-const);
  align-content: flex-start;
  flex-direction: column;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: calc(1.5 * var(--spacing-const));
  overflow-x: auto;

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
  padding-top: 5rem;
}

.frame::before {
  position: absolute;
  width: 100%;
  height: 80%;
  bottom: 2rem;
  pointer-events: none;

  border-radius: var(--border-radius);
  content: '';
  z-index: 1;
  background: linear-gradient(to  left, transparent 98%, var(--color-background) 99.5%, var(--color-background)),
              linear-gradient(to right, transparent 98%, var(--color-background) 99.5%, var(--color-background));
}

</style>