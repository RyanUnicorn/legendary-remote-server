<script setup>
    import '../blockly/blocks.js';
    import Blockly from 'blockly';
    import {javascriptGenerator} from 'blockly/javascript';
    import { ref, onMounted, shallowRef } from 'vue';
    import { globals } from '../main';
    import axios from 'axios';
    import { useRoute } from 'vue-router';

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
            // console.log(blocklyValue.value.blocklyWorkspace);
        } catch(err) {
            console.error(err);
        }

    }

    async function handleUpdateBlockly(JSValue, workspaceValue) {
        /**
         * TODO api call to update blockly
         * * PUT /api/devices/{deviceId}
         */

        try {
            await axios.put(`${globals.$origin}/api/devices/${currentId}`, {
                blocklyJS: JSValue,
                blocklyWorkspace: workspaceValue,
            });
        } catch(err) {
            console.error(err);
        }
    }

    const initializeBlockly = () => {
        workspace.value = Blockly.inject(blocklyDiv.value, {
            toolbox: document.getElementById('toolbox'),
        });

        if (workspace.value) {
            workspace.value.addChangeListener(updateCode);
        } else {
            console.error('Workspace is not initialized properly.');
        }
    };


    function loadingWorkspace(){
        const jsonString = blocklyValue.value.blocklyWorkspace;
        const parsedObject = JSON.parse(jsonString);
        Blockly.serialization.workspaces.load(parsedObject, workspace.value);
    }

    const updateCode = () => {
        if (workspace.value) {
            const code = javascriptGenerator.workspaceToCode(workspace.value);
            console.log(code);
        } else {
            console.error('Workspace is not initialized properly.');
        }
    };

    function saveWorkspace(){
        const code = javascriptGenerator.workspaceToCode(workspace.value);
        if (code) {
            console.log(JSON.stringify(Blockly.serialization.workspaces.save(workspace.value), null, 2));
            handleUpdateBlockly(code, JSON.stringify(Blockly.serialization.workspaces.save(workspace.value)));
            alert("Success");
        }
        else alert("Fail");
    }

    onMounted(async () => {
        await fetchBlockly();
        initializeBlockly();
        loadingWorkspace();
    });

</script>

<template>
    
    <xml id="toolbox" style="display:none;">
        <category name="Math" colour="230">
            <block type="math_number"></block>
            <block type="math_arithmetic"></block>
        </category>
        <category name="Examples" colour="120">
            <block type="Example 1"></block>
            <block type="Example 2"></block>
            <block type="Example 3"></block>
        </category>
    </xml>

    <div class="blocklyArea">
        <div ref="blocklyDiv" class="neu-box" style="height: 100%; width: 100%;"/>
        <div @click="saveWorkspace" class="neu-box save-btn">Save</div>
    </div>

</template>

<style>
    .blocklyArea {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .save-btn{
        height: 30px;
        width: 100px;
        min-width: 70px;
        min-height: 20px;

        position: absolute;
        top: 1rem;
        right: 1rem;

        font-size: 1rem;
        color: var(--color-accent);

        display: flex;
        align-items: center;
        justify-content: center;

        cursor: pointer;
    }

    .blocklySvg {
        background-color: var(--color-background);
        border-radius: var(--border-radius);
    }

    .blocklyToolboxDiv {
        padding-top: 24px;
        border-radius: var(--border-radius);
        background-color: var(--color-background);
    }
</style>
