<script setup>

  const emit = defineEmits([
    'cancel',
  ]);

</script>

<template>
  <div class="new-entity-wrapper">
    <a @click="$emit('cancel')">&lt Back</a>
    <div class="new-entity">

    </div>
  </div>
</template>

<style scoped>
  .new-entity-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius);

    padding-inline: 2rem;
    padding-block: 1.2rem;

    & a {
      cursor: pointer;
      font-size: 1.6rem;
      font-weight: bold;
      color: var(--color-accent);
    }
  }
</style>