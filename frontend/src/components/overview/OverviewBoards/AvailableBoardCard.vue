<script setup>

  const props = defineProps([
    'boardData',
  ]);

  const emit = defineEmits([
    'pair', // pair(id)
  ])

</script>

<template>
   <div class="available-board-card neu-box">
    <h1>{{ boardData?.id.match(/.{1,2}/g).join(':') }}</h1>
    <p>Online</p>
    <button class="neu-box pair-btn" @click="$emit('pair', boardData.id)">
      PAIR
    </button>
   </div>
</template>

<style scoped>

  .pair-btn {
    position: absolute;
    bottom: 1rem;
    right: 1rem;

    background-color: var(--color-background);
    border: none;
    
    padding-inline: 1rem;
    padding-block: 0.5rem;
    color: var(--color-text);

    transition: 200ms;
    &:hover {
      cursor: pointer;
      color: var(--color-accent);
      box-shadow:  7px  7px 20px #bebebe,
                    -9px -9px 20px #ffffff;
    }

    &:focus-visible {
      outline: var(--color-accent-mute) solid 3px;
    }
  }

  .available-board-card {
    position: relative;
    scroll-snap-align: start;
    padding-block: 0.8rem;
    padding-inline: 1.5rem;
    width: 15rem;
    flex-basis: 45%;

    font-size: 1.3rem;
    color: var(--color-text);
    
    & h1 {
      font-size: 1.2rem;
      font-weight: 400;
      color: var(--color-text);
    }

    & p {
      position: absolute;
      padding-inline: 0.8rem;
      border-radius: 1rem;
      bottom: 1rem;

      font-size: 0.9rem;
      
      background-color: var(--color-accent-mute);
      color: var(--color-accent);
    }

  }

  @media(max-height: 930px) {
    .available-board-card {
      flex-basis: 43%;
    }
  }

  @media(max-height: 820px) {
    .available-board-card {
      flex-basis: 90%;
    }
  }
</style>