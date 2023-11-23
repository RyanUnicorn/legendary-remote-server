<script setup>

  const props = defineProps([
    'isModalOpen',
  ]);

  const toggleModal = () => {
    emit('close');
  };
  
  const emit = defineEmits([
    'close',
  ])

</script>

<template>
  <div>
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="isModalOpen" class="modal">
          <div class="modal-content">
            <span @click="toggleModal" class="close-btn">×</span>
            <p>這是彈出視窗的內容。</p>
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
  z-index: 2;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  z-index: 3;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  cursor: pointer;
}
</style>
