<script setup>
  import DeviceIRCodesAddingCard from './DeviceIRCodes/IRCodesAddingCard.vue';
  import DeviceIRCodesInfoCard from './DeviceIRCodes/IRCodesInfoCard.vue';
  import { ref, watchEffect } from 'vue';
  import PopUp from './DeviceIRCodes/IRCodePopUp.vue';
  
  const props = defineProps([
    'IRCodes',
    'boardId',
    'irSendInterval',
  ]);

  const isPopUp = ref(false);
  const inputInterval = ref('');
  const inputElement  = ref(null);

  watchEffect(() => {
    inputInterval.value = props.irSendInterval;
  });

  function popUPswitch(){
    isPopUp.value = !isPopUp.value;
  }

  const emit = defineEmits([
    'rename',
    'redescribe',
    'delete',
    'saveNewIRCode',
    'saveInfoIRCode',
    'irSendIntervalChange',
  ])

  function addingIRCode(){
    popUPswitch();
  }

</script>

<template>
  <div class="neu-box IRCodeFrame">
    <h3>IR Code</h3>
    <div class="intervalBlock">
      <h2>Interval</h2>
      <input
        v-model="inputInterval"
        ref="inputElement"
        class="neu-box interval-input"
        type="text"
        @keyup.enter="inputElement.blur()"
        @blur="$emit('irSendIntervalChange', inputInterval)"
      />
    </div>
    <div class="container">
      <DeviceIRCodesInfoCard v-for="IRCode in IRCodes" :key="IRCodes.id"
        :IRCodedata="IRCode"
        :boardId="props.boardId"
        @rename = "(id, name) => $emit('rename', id, name)"
        @redescribe = "(id, description) => $emit('redescribe', id, description)"
        @delete = "(id) => $emit('delete', id)"
        @saveInfoIRCode = "(boardId, receiveRawdata, receiveCode, IRCodeId, DeviceId) => $emit('saveInfoIRCode', boardId, receiveRawdata, receiveCode, IRCodeId, DeviceId)"
      />
      <DeviceIRCodesAddingCard @click="addingIRCode"/>
      <PopUp 
        :isModalOpen = "isPopUp"
        :boardId="props.boardId"
        @close="popUPswitch"
        @saveIRCode="(boardId, receiveRawdata, receiveCode) => $emit('saveNewIRCode', boardId, receiveRawdata, receiveCode)"
      />
    </div>
  </div>
</template>

<style scoped>
  .IRCodeFrame{
    min-width: 300px;
    position: relative;
    padding: var(--spacing-const);
    
    display: flex;
    align-items: end;
    justify-content: center;

    & h3{
      position: absolute;
      top: 1.2rem;
      left: 2rem;
      font-weight: bold;
      font-size: 1.5rem;
      color: var(--color-text-mute);
    }
  }

  .intervalBlock {
    position: absolute;
    top: 1.5rem;
    right: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    & h2{
      font-size: 1rem;
      color: var(--color-text-mute);
    }
  }

  .interval-input {
    padding-top: 8px;
    padding-bottom: 8px;
    font-size: 1rem;
    color: var(--color-accent);
    background-color: var(--color-background);
    border: none;
    outline: none;
    text-align: center;
    width: 70px;
    z-index: 2;

    &::placeholder {
      color: var(--color-text-mute);
    }
  }

  .container {
    position: absolute;
    
    display: flex;
    height: 80%;
    width: 100%;
    padding: var(--spacing-const);
    flex-wrap: wrap;
    gap: var(--spacing-const);
    justify-content: center;
    align-content: flex-start;
    flex-direction: row;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scroll-padding-top: calc(1 * var(--spacing-const));

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
  }

  .IRCodeFrame::before {
    position: absolute;
    height: 80%;
    width: 100%;
    pointer-events: none;

    border-radius: var(--border-radius);
    content: '';
    z-index: 1;
    background: linear-gradient(to  top, transparent 98%, var(--color-background) 99.5%, var(--color-background)),
                linear-gradient(to bottom, transparent 98%, var(--color-background) 99.5%, var(--color-background));
  }
</style>