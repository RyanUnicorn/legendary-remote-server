<script setup>
  import { RouterLink, useRouter } from 'vue-router'
  import OverviewDevicesAddingCard from './OverviewDevices/OverviewDevicesAddingCard.vue';
  import OverviewDevicesInfoCard from './OverviewDevices/OverviewDevicesInfoCard.vue';
  import { onMounted, ref } from 'vue';
  import { globals } from '../../main';
  import axios from 'axios';

  const router = useRouter();

  const devices = ref([]);

  async function fetchDevices(){
    /**
     * * GET /api/devices
     */

    try {
      const result = await axios.get(`${globals.$origin}/api/devices`);
      devices.value = result.data;
    } catch(err) {
      console.error(err);
    }
  }

  async function addDevice(){
    /**
     * * POST /api/devices
     */
    
    try {
      const result = await axios.post(`${globals.$origin}/api/devices`, {
        name: 'New Device',
      })
      router.push(`/devices/${result.data.id}`);
    } catch(err) {
      console.error(err);
    }
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
        <OverviewDevicesInfoCard :deviceName="data.name" :entities="data.entityCount" :enableUpdate="data.enableUpdate"/>
      </RouterLink>
      <OverviewDevicesAddingCard @click="addDevice"/>
    </div>
  </div>
</template>

<style scoped>
  .frame {
    position: relative;
    & h3{
      position: absolute;
      top: 1.2rem;
      left: 2rem;
      font-weight: bold;
      font-size: 1.5rem;
      color: var(--color-text-mute);
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