<script setup>
  import { RouterLink } from 'vue-router'
  import DeviceIRCodesAddingCard from './DeviceIRCodes/IRCodesAddingCard.vue';
  import DeviceIRCodesInfoCard from './DeviceIRCodes/IRCodesInfoCard.vue';
  import { onMounted, ref } from 'vue';

  const props = defineProps([
    'IRCodes',
  ]);

  const emit = defineEmits([
    'rename',
    'redescribe',
    'delete',
  ])

</script>

<template>
  <div class="neu-box IRCodeFrame">
    <h3>IR Code</h3>
    <div class="container">
      <DeviceIRCodesInfoCard v-for="IRCode in IRCodes" :key="IRCodes.id"
        :IRCodedata="IRCode"
        @rename = "(id, name) => $emit('rename', id, name)"
        @redescribe = "(id, description) => $emit('redescribe', id, description)"
        @delete = "(id) => $emit('delete', id)"
      />
      <DeviceIRCodesAddingCard/>
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