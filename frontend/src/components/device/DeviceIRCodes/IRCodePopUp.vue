<script setup>

  import { onMounted, ref } from 'vue';

  const props = defineProps([
    'isModalOpen',
    'boardId'
  ]);

  const toggleModal = () => {
    if(isReceive.value){
      isReceive.value = false;
    }
    else {
      showRecordButton.value = true;
      isReceive.value = false;
      receiveRawdata.value = [];
      emit('close');
    }
  };
  
  const emit = defineEmits([
    'close',
    'saveIRCode'
  ])

  const receiveRawdata = ref([]);
  const showRecordButton = ref(true);
  const isReceive = ref(false);

  function recordRawdata(){
    showRecordButton.value = !showRecordButton.value;

    //api record fuc(boardId)

    setTimeout(() => {
      receiveRawdata.value = [123];
      if(receiveRawdata.value.length>0)isReceive.value = !isReceive.value;
      console.log("Receive raw-data " + receiveRawdata.value);
      showRecordButton.value = !showRecordButton.value;
    }, 3000);
  }

  function replayRawdata(){
    console.log("Send raw data " + receiveRawdata.value + (" as board ") + props.boardId);
    //api send receiveRawdata
  }

  function saveIRCode(){
    //api Update IRCode with receiveRawdata
    emit('saveIRCode', props.boardId, receiveRawdata.value);
    showRecordButton.value = true;
    isReceive.value = false;
    receiveRawdata.value = [];
    emit('close');
  }

</script>

<template>
  <div>
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="isModalOpen" class="modal">
          <div class="modal-content">
            <span v-if="showRecordButton" @click="toggleModal" class="back-btn">&lt; Back</span>
            <div v-if="showRecordButton && !isReceive" @click="recordRawdata" class="neu-box record-btn">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M192 32c0-17.7 14.3-32 32-32C383.1 0 512 128.9 512 288c0 17.7-14.3 32-32 32s-32-14.3-32-32C448 164.3 347.7 64 224 64c-17.7 0-32-14.3-32-32zM60.6 220.6L164.7 324.7l28.4-28.4c-.7-2.6-1.1-5.4-1.1-8.3c0-17.7 14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32c-2.9 0-5.6-.4-8.3-1.1l-28.4 28.4L291.4 451.4c14.5 14.5 11.8 38.8-7.3 46.3C260.5 506.9 234.9 512 208 512C93.1 512 0 418.9 0 304c0-26.9 5.1-52.5 14.4-76.1c7.5-19 31.8-21.8 46.3-7.3zM224 96c106 0 192 86 192 192c0 17.7-14.3 32-32 32s-32-14.3-32-32c0-70.7-57.3-128-128-128c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>
              Record
            </div>
            <div v-else-if="isReceive" class="receivePage">
              <svg xmlns="http://www.w3.org/2000/svg" height="10em" style="fill:var(--color-accent)" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
              <div  @click="replayRawdata" class="neu-box replay-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
                Replay
              </div>
              <div  @click="saveIRCode" class="neu-box save-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M48 96V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V170.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H309.5c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8V184c0 13.3-10.7 24-24 24H104c-13.3 0-24-10.7-24-24V80H64c-8.8 0-16 7.2-16 16zm80-16v80H272V80H128zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/></svg>
                Save
              </div>
            </div>
            <div v-else class="hollow-dots-spinner">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  .modal-content {
    background-color: var(--color-background);
    height: 400px;
    width: 800px;
    display: flex;
    border-radius: 8px;
    position: relative;
    z-index: 11;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius);
    box-shadow:  5px  5px 16px #595959,
                -5px -5px 16px #595959;
  }

  .back-btn {
    position: absolute;
    height: 50px;
    width: 100px;
    top: 12px;
    left: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-accent);
    cursor: pointer;
    z-index: 1;
  }

  .record-btn{
    display: flex;
    height: 80px;
    width: 200px;
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-text-mute);
    fill: var(--color-text-mute);
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 200ms;
    gap: 12px;
    &:hover{
      color: var(--color-accent);
      fill: var(--color-accent);
    }
  }

  .receivePage{
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap:12px
  }

  .save-btn{
    position: absolute;
    bottom: 24px;
    right: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;

    font-size: 1.5rem;
    font-weight: bold;

    color: var(--color-text-mute);
    fill: var(--color-text-mute);

    transition: 200ms;

    &:hover{
      color: var(--color-accent);
      fill: var(--color-accent);
    }

    cursor: pointer;

    height: 50px;
    width: 120px;
  }

  .replay-btn{
    padding-inline: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    font-size: 1.5rem;
    font-weight: bold;

    color: var(--color-text-mute);
    fill: var(--color-text-mute);

    transition: 200ms;

    &:hover{
      color: var(--color-accent);
      fill: var(--color-accent);
    }

    cursor: pointer;

    height: 50px;
    width: 150px;
  }

  .hollow-dots-spinner, .hollow-dots-spinner * {
    box-sizing: border-box;
  }

  .hollow-dots-spinner {
    height: 15px;
    width: calc(30px * 3);
  }

  .hollow-dots-spinner .dot {
    width: 15px;
    height: 15px;
    margin: 0 calc(15px / 2);
    border: calc(15px / 5) solid #ff1d5e;
    border-radius: 50%;
    float: left;
    transform: scale(0);
    animation: hollow-dots-spinner-animation 1000ms ease infinite 0ms;
  }

  .hollow-dots-spinner .dot:nth-child(1) {
    animation-delay: calc(300ms * 1);
  }

  .hollow-dots-spinner .dot:nth-child(2) {
    animation-delay: calc(300ms * 2);
  }

  .hollow-dots-spinner .dot:nth-child(3) {
    animation-delay: calc(300ms * 3);

  }

  @keyframes hollow-dots-spinner-animation {
    50% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

</style>
