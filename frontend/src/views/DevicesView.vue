<script setup>
  import DeviceName from '../components/device/DeviceName.vue';
  import DeviceEntities from '../components/device/DeviceEntities.vue';
  import DeviceBlocklyCode from '../components/device/DeviceBlocklyCode.vue';
  import DeviceIRCodes from '../components/device/DeviceIRCodes.vue';
  import { useRoute } from 'vue-router';
  import { ref, onMounted } from 'vue';

  const route = useRoute();
  const currentId = route.params.id;

  const device = ref([]);
  const boardList = ref([]);

  function fetchaDevice(id){
    device.value = {
      id: 1,
      boardId: '123456789ABC',
      name: "Example device",
      enableUpdate: true,
      blocklyWorkspace: "...",
      blocklyJS: "...",
      entities:[
        {
          id: 1,
          deviceId: 1,
          name: "Example entity",
          icon: "mdi:unicorn",
          type: "switch",
          subtype: {
            entityId: 1,
            state: true,
          }
        },
      ],
      irCodes: [
        {
          id: 1,
          deviceId: 1,
          name: "Example IR code name",
          description: "Example IR code description",
          rawData: [
            123,
            200,
            600,
            111,
            420,
            69
          ]
        },
        {
          id: 2,
          deviceId: 1,
          name: "Example 2 IR code name",
          description: "Example 2 IR code description",
          rawData: [
            222,
            222,
            600,
            111,
            420,
            69
          ]
        },
      ]
    }
  }

  async function fetchBoardList() {
    /**
     * TODO api call here
     */
    boardList.value = [
      {
        id: '123456789ABC',
        name: 'A ESP board',
      },
      {
        id: '23456789ABCD',
        name: 'Living room',
      },
      {
        id: '3456789ABCDE',
        name: 'Bathroom',
      },
      {
        id: '456789ABCDEF',
        name: 'Bedroom',
      },
      {
        id: '56789ABCDEF1',
        name: 'Basement',
      },
      {
        id: '6789ABCDEF12',
        name: 'Kitchen',
      },
    ];
  }

  function handleIRCodeRename(id, name) {
    console.log('renaming', id, 'to', name);
    /**
     * TODO: api call to update irCode
     */
    fetchaDevice();
  }

  function handleIRCodeRedescribe(id, description) {
    console.log('redescribe', id, 'to', description);
    /**
     * TODO: api call to update irCode
     */
    fetchaDevice();
  }

  function handleIRCodeDelete(id) {
    console.log('delete', id);
    /**
     * TODO: api call to update irCode
     */
    fetchaDevice();
  }

  function handleUpdateDeviceInfo(device) {
    console.log('updating device with body', device);
    /**
     * TODO api call to update device
     */
    fetchaDevice();
  }

  function handleDeleteDevice() {
    console.log('deleting device');
    /**
     * TODO api call to delete device
     */
  }

  function handleIRCodeRecord(id) {
    console.log('record', id);
    /**
     * TODO: api call to unpair the board
     */
    fetchaDevice();
  }

  onMounted(() => {
    fetchaDevice(currentId);
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
        <DeviceEntities/>
    </div>
    <div class="right">
        <DeviceBlocklyCode/>
        <DeviceIRCodes
          :IRCodes = "device.irCodes"
          @rename="handleIRCodeRename"
          @redescribe="handleIRCodeRedescribe"
          @delete="handleIRCodeDelete"
          @record="handleIRCodeRecord"
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