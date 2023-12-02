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

  async function handleIRSendIntervalChange(irSendInterval) {
    if(device.value.irSendInterval != irSendInterval){
      try {
        await axios.put(`${globals.$origin}/api/devices/${currentId}`, {
          irSendInterval: irSendInterval,
        });
      } catch(err) {
        console.error(err);
      }
    }
    fetchDevice();
  }

  async function handlSavingNewIRCode( boardId, receiveRawdata, receiveCode){
    
    try {
      await axios.post(`${globals.$origin}/api/ircodes`, {
        deviceId: currentId,
        name: 'New IRCode',
        description: 'New Description',
        code: receiveCode,
        rawData: receiveRawdata,
      });
    } catch(err) {
      console.error(err);
    }
    fetchDevice();
  }

  async function handleSavingInfoIRCode( boardId, receiveRawdata, receiveCode, IRCodeId, DeviceId) {
    try {
      await axios.put(`${globals.$origin}/api/ircodes/${IRCodeId}`, {
        code: receiveCode,
        rawData: receiveRawdata,
      });
    } catch(err) {
      console.error(err);
    }
    fetchDevice();
  }

  async function handleIRCodeRename(id, name) {
    /**
     * * PUT /api/ircodes/{ircodesId}
     */

    try {
      await axios.put(`${globals.$origin}/api/ircodes/${id}`, {
        name,
      });
    } catch(err) {
      console.error(err);
    }

    fetchDevice();
  }

  async function handleIRCodeRedescribe(id, description) {
    /**
     * * PUT /api/ircodes/{ircodesId}
     */

    try {
      await axios.put(`${globals.$origin}/api/ircodes/${id}`, {
        description,
      });
    } catch(err) {
      console.error(err);
    }

    fetchDevice();
  }

  async function handleIRCodeDelete(id) {
    /**
     * * DELETE /api/ircodes/{ircodesId}
     */
    try {
      await axios.delete(`${globals.$origin}/api/ircodes/${id}`);
    } catch(err) {
      console.error(err);
    }

    fetchDevice();

  }

  async function handleUpdateDeviceInfo(device) {
    console.log('updating device with body', device);
    /**
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
     * * DELETE /api/devices/{deviceId}
     */

    try {
      await axios.delete(`${globals.$origin}/api/devices/${currentId}`, device);
      router.push({ path: '/overview', replace: true });
    } catch(err) {
      console.error(err);
    }

  }

  async function handleRenameEntity(id, name) {
    console.log('renaming entity', id, name);
    /**
     * * PUT /api/entities/{entityId}
     */

    try {
      await axios.put(`${globals.$origin}/api/entities/${id}`, {
        name,
      });
    } catch(err) {
      console.error(err);
    }

    fetchDevice();
  }

  async function handleDeleteEntity(id) {
    console.log('deleting entity', id);
    /**
     */
    try {
      await axios.delete(`${globals.$origin}/api/entities/${id}`);
    } catch(err) {
      console.error(err);
    }
    fetchDevice();
  }

  async function handleNewNumber(entityName, options) {
    console.log('new number', entityName, options);
    /**
     * * POST /api/entities
     */
    
     try {
      await axios.post(`${globals.$origin}/api/entities`, {
        deviceId: currentId,
        name: entityName,
        type: 'number',
        number: {
          ...options,
          state: options.min, // defaults to the min number
        },
      });
    } catch(err) {
      console.error(err);
    }

    fetchDevice();
  }

  async function handleNewSelect(entityName, options) {
    console.log('new select', entityName, options);
    /**
     * * POST /api/entities
     */
    
    try {
      await axios.post(`${globals.$origin}/api/entities`, {
        deviceId: currentId,
        name: entityName,
        type: 'select',
        select: {
          ...options,
          state: options.options[0], // defaults to the first option
        },
      });
    } catch(err) {
      console.error(err);
    }

    fetchDevice();
  }

  async function handleNewButton(entityName) {
    console.log('new button', entityName);
    /**
     * * POST /api/entities
     */

    try {
      await axios.post(`${globals.$origin}/api/entities`, {
        deviceId: currentId,
        name: entityName,
        type: 'button',
        button: {},
      });
    } catch(err) {
      console.error(err);
    }

    fetchDevice();
  }

  async function handleNewSwitch(entityName) {
    console.log('new switch', entityName);
    /**
     * * POST /api/entities
     */

    try {
      await axios.post(`${globals.$origin}/api/entities`, {
        deviceId: currentId,
        name: entityName,
        type: 'switch',
        switch: {
          state: false, // default false
        },
      });
    } catch(err) {
      console.error(err);
    }

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
          :irSendInterval = "device.irSendInterval"
          @rename="handleIRCodeRename"
          @redescribe="handleIRCodeRedescribe"
          @delete="handleIRCodeDelete"
          @saveInfoIRCode="handleSavingInfoIRCode"
          @saveNewIRCode="handlSavingNewIRCode"
          @irSendIntervalChange="handleIRSendIntervalChange"
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