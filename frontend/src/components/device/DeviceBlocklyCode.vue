<script setup>
  import ToolBox from '../../blockly/ToolBox.vue'
  import { useRoute } from 'vue-router';
  import Blockly from 'blockly';
  import { ref, onMounted, shallowRef } from 'vue';
  import { globals } from '../../main';
  import axios from 'axios';
  
  const route = useRoute();
  const currentId = route.params.id;
  const blocklyValue = ref([]);
  const blocklyDiv = ref(null);
  const workspace = shallowRef();

  async function fetchBlockly(){
    /**
     * * GET /api/devices/{deviceId}
     */

    try {
      const result = await axios.get(`${globals.$origin}/api/devices/${currentId}`);
      blocklyValue.value = result.data;
    } catch(err) {
      console.error(err);
    }

  }

  function loadingWorkspace(){
    const jsonString = blocklyValue.value.blocklyWorkspace;
    const parsedObject = JSON.parse(jsonString);
    Blockly.serialization.workspaces.load(parsedObject, workspace.value);
  }

  const initializeBlockly = () => {
    workspace.value = Blockly.inject(blocklyDiv.value, {
      readOnly: true,
    });
    const workspaceSvg = workspace.value.getParentSvg();
    if (workspaceSvg) {
      workspaceSvg.style.backgroundColor = 'var(--color-background)';
      workspaceSvg.style.borderRadius =  'var(--border-radius)';
      workspaceSvg.style.boxShadow = 'inset 5px 5px 16px #bebebe, inset -5px -5px 16px #ffffff';
    }
  };

  onMounted(async () => {
    await fetchBlockly();
    initializeBlockly();
    loadingWorkspace();
  });
</script>

<template>
  <ToolBox :deviceId="currentId"/>
  <div class="neu-box blocklyWrapper">
    <h3>Blockly Code</h3>
    <RouterLink :to= "`/blockly/${currentId}`">
      <div class="neu-box editButton">  
        EDIT
      </div>
    </RouterLink>
    <div class="blockly">
        <div ref="blocklyDiv" class="blockly-area" />
    </div>
  </div>
</template>

<style scoped>

  .blocklyWrapper {
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

  .blockly-area {
    height: 100%;
    width: 100%;
  }

  .editButton {
    height: 10%;
    width: 10%;
    min-width: 70px;
    min-height: 20px;

    position: absolute;
    top: 1.2rem;
    right : 2rem;

    font-size: 1.25rem;
    color: var(--color-accent);

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .blockly {
    height: 85%;
    width: 100%;
  }


</style>