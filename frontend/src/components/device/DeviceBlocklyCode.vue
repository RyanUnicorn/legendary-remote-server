<script setup>
  const blocklyPath = "/blocklyPath";
</script>

<template>
  <div class="neu-box blocklyWrapper">
    <h3>Blockly Code</h3>
    <RouterLink :to= "blocklyPath">
      <div class="neu-box editButton">  
        EDIT
      </div>
    </RouterLink>
    <div class="blockly"></div>
  </div>
</template>

<style scoped>

  .blocklyWrapper{
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

  .editButton{
    height: 10%;
    width: 10%;

    position: absolute;
    top: 1.2rem;
    right : 2rem;

    font-size: 1.25rem;
    color: var(--color-accent);

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .blockly{
    height: 85%;
    width: 100%;

    border-radius: var(--border-radius);
    box-shadow: inset  5px  5px 16px #bebebe,
                inset -5px -5px 16px #ffffff;
  }

</style>