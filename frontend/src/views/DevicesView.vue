<script setup>
  import DeviceName from '../components/device/DeviceName.vue';
  import DeviceEntities from '../components/device/DeviceEntities.vue';
  import DeviceBlocklyCode from '../components/device/DeviceBlocklyCode.vue';
  import DeviceIRCodes from '../components/device/DeviceIRCodes.vue';
</script>

<template>
  <div class="deviceview-grid">
    <div class="left">
        <DeviceName/>
        <DeviceEntities/>
    </div>
    <div class="right">
        <DeviceBlocklyCode/>
        <DeviceIRCodes/>
    </div>
  </div>
</template>

<style scoped>
.deviceview-grid {
  /* padding: 0; */
  height: 100%;
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 1fr;
}

.left {
  /* padding: 0; */
  height: 100%;
  display: grid;
  gap: var(--spacing-const);
  grid-template-rows: 1fr 3fr;
}

.right {
  /* padding: 0; */
  height: 100%;
  display: grid;
  gap: var(--spacing-const);
  grid-template-rows: 1fr 1fr;
}
</style>