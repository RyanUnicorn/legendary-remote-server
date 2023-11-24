<script setup>
  import { ref, watch } from 'vue';
  import EditableTextInline from '../shared/EditableTextInline.vue';
  import CheckBox from '../shared/CheckBox.vue'

  const props = defineProps({
    'deviceInfo': Object,
    'boardList': Array,
  });

  const emit = defineEmits([
    'updateDeviceInfo', // updateDeviceInfo(device);
    'deleteDevice', // deleteDevice()
  ])

  const selectedBoard = ref(props.deviceInfo.boardId);
  const enableUpdate = ref(props.deviceInfo.enableUpdate);
  const name = ref(props.deviceInfo.name);

  watch([
    () => props.deviceInfo?.boardId,
    () => props.deviceInfo?.enableUpdate,
    () => props.deviceInfo?.name,
  ],([
    newBoardId,
    newEnableUpdate,
    newName,
  ]) => {
    selectedBoard.value = newBoardId;
    enableUpdate.value = newEnableUpdate;
    name.value = newName;
  });
  
  function handleUpdateName(deviceName) {
    emit('updateDeviceInfo', {
      name: deviceName,
    });
  }

  function handleUpdateSelectedBoard(boardId) {
    emit('updateDeviceInfo', {
      boardId: boardId,
    });
  }

  function handleUpdateEnableUpdate(enabled) {
    emit('updateDeviceInfo', {
      enableUpdate: enabled,
    });
  }

  function handleDeleteDevice() {
    const result = confirm('Are you sure you want to delete the whole device?\nThis CANNOT be undo!');
    if(result) {
      emit('deleteDevice');
    }
  }

</script>

<template>
  <div class="neu-box device-name-wrapper">
    <EditableTextInline class="device-name"
      :text="deviceInfo.name"
      @rename="handleUpdateName"
    />
    
    <button class="delete-btn neu-box"
      @click="handleDeleteDevice"
    >
      DELETE
    </button>

    <div class="form-wrapper">
      <div class="form-input-wrapper">
        <span>Use Board</span>
        <select class="deivce-name-board-select"
          v-model="selectedBoard"
          @change="(event) => handleUpdateSelectedBoard(event.target.value)"
          >
          <option v-for="board in boardList" :key="board.id"
            :value="board.id">
            {{ board.name }}
          </option>
        </select>  
      </div>
      <div class="form-input-wrapper">
        <span>Enable Update</span>
        <CheckBox class="form-check-box"
          v-model="enableUpdate"
          @update:model-value="handleUpdateEnableUpdate"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

  .delete-btn {
    position: absolute;
    top: var(--spacing-const);
    right: var(--spacing-const);

    border: none;
    background-color: var(--color-background);

    font-size: 1rem;
    color: var(--color-accent);

    padding-inline: 1rem;
    padding-block: 0.8rem;

    transition: 200ms;
    &:hover {
      cursor: pointer;
      color: var(--color-accent);
      box-shadow:  7px  7px 20px #bebebe,
                    -9px -9px 20px #ffffff;
    }
  }

  .form-wrapper {
    position: absolute;
    bottom: var(--spacing-const);
    display: flex;
    width: 100%;
    gap: var(--spacing-const);
  }

  .form-input-wrapper {
    display: flex;
    flex-basis: 50%;
    flex-direction: column;
    gap: 0.2rem;
    font-size: 1.3rem;
    
    & span {
      color: var(--color-text-mute);
      z-index: 1;
      font-size: 0.8em;
    }
  }

  .form-check-box {
    font-size: 1em;
  }

  .deivce-name-board-select {
    font-size: 1em;
    width: fit-content;
  }
  .device-name-wrapper {
    position: relative;
    padding-block: 1.5rem;
    padding-inline: var(--spacing-const);
  }

  .device-name {
    font-weight: bolder;
    font-size: 1.6rem;
  }
</style>