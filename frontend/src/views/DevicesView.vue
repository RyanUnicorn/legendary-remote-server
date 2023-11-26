<script setup>
  import DeviceName from '../components/device/DeviceName.vue';
  import DeviceEntities from '../components/device/DeviceEntities.vue';
  import DeviceBlocklyCode from '../components/device/DeviceBlocklyCode.vue';
  import DeviceIRCodes from '../components/device/DeviceIRCodes.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import { globals } from '../main';
  import axios from 'axios';

  const route = useRoute();
  const router = useRouter();
  const currentId = route.params.id;

  const device = ref({});
  const boardList = ref([]);

  async function fetchDevice(){
    /**
     * * GET /api/devices/{deviceId}
     */

    try {
      const result = await axios.get(`${globals.$origin}/api/devices/${currentId}`);
      device.value = result.data;
    } catch(err) {
      console.error(err);
    }
  }

  async function fetchBoardList() {
    /**
     * * GET /api/boards
     */

    try {
      let result = await axios.get(`${globals.$origin}/api/boards`);
      boardList.value = result.data;
    } catch(err){
      console.error(err);
    }
  }

  function handleIRCodeRename(id, name) {
    console.log('renaming', id, 'to', name);
    /**
     * TODO: api call to update irCode
     */
    fetchDevice();
  }

  function handleIRCodeRedescribe(id, description) {
    console.log('redescribe', id, 'to', description);
    /**
     * TODO: api call to update irCode
     */
    fetchDevice();
  }

  function handleIRCodeDelete(id) {
    console.log('delete', id);
    /**
     * TODO: api call to update irCode
     */
    fetchDevice();
  }

  function handleSavingIRCode( boardId, receiveRawdata, IRCodeId, deviceId) {
    console.log('Save IRCode', receiveRawdata, "BoardID", boardId, "IRCodeID", IRCodeId, "DeviceID", deviceId);
    /**
     * TODO: api call to unpair the board
     */
    fetchDevice();
  }

  async function handleUpdateDeviceInfo(device) {
    console.log('updating device with body', device);
    /**
     * TODO api call to update device
     * * PUT /api/devices/{deviceId}
     */

    try {
      await axios.put(`${globals.$origin}/api/devices/${currentId}`, device);
    } catch(err) {
      console.error(err);
    }

    fetchDevice();
  }

  async function handleDeleteDevice() {
    console.log('deleting device');
    /**
     * TODO api call to delete device
     * * DELETE /api/devices/{deviceId}
     */

    try {
      await axios.delete(`${globals.$origin}/api/devices/${currentId}`, device);
      router.push({ path: '/overview', replace: true });
    } catch(err) {
      console.error(err);
    }

  }

  function handleRenameEntity(id, name) {
    console.log('renaming entity', id, name);
    fetchDevice();
  }

  function handleDeleteEntity(id) {
    console.log('deleting entity', id);
    fetchDevice();
  }

  function handleNewNumber(entityname, options) {
    console.log('new number', entityname, options);
    fetchDevice();
  }

  function handleNewSelect(entityname, options) {
    console.log('new select', entityname, options);
    fetchDevice();
  }

  function handleNewButton(entityname) {
    console.log('new button', entityname);
    fetchDevice();
  }

  function handleNewSwitch(entityname) {
    console.log('new switch', entityname);
    fetchDevice();
  }

  function handleAddingIRCode() {
    fetchDevice();
  }

  onMounted(() => {
    fetchDevice();
    fetchBoardList();
  });

</script>

<template>
  <div class="deviceview-grid">
    <div class="left">
        <DeviceName
          :device-info="device"
          :board-list="boardList"
          @update-device-info="handleUpdateDeviceInfo"
          @delete-device="handleDeleteDevice"
        />
        <DeviceEntities
          :entities="device.entities"
          @rename-entity="handleRenameEntity"
          @delete-entity="handleDeleteEntity"
          @new-number="handleNewNumber"
          @new-select="handleNewSelect"
          @new-button="handleNewButton"
          @new-switch="handleNewSwitch"
        />
    </div>
    <div class="right">
        <DeviceBlocklyCode/>
        <DeviceIRCodes
          :IRCodes = "device.irCodes"
          :boardId = "device.boardId"
          :deviceId="device.id"
          @rename="handleIRCodeRename"
          @redescribe="handleIRCodeRedescribe"
          @delete="handleIRCodeDelete"
          @saveIRCode="handleSavingIRCode"
          @addIRCode="handleAddingIRCode"
        />
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
  /* height: 100%; */
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