<script setup>
    import ToolBox from'../blockly/ToolBox.vue';
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
    const showSuccessPopup = ref(false);
    const showFailPopup = ref(false);
    var toolBox = "toolbox-example1";

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

    const initializeBlockly = () => {
        workspace.value = Blockly.inject(blocklyDiv.value, {
            toolbox: document.getElementById(toolBox),
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

    async function saveWorkspace(){
        /**
         * TODO api call to update blockly
         * * PUT /api/devices/{deviceId}
         */
        const JSValue = javascriptGenerator.workspaceToCode(workspace.value);
        const workspaceValue = JSON.stringify(Blockly.serialization.workspaces.save(workspace.value));
        try {
            await axios.put(`${globals.$origin}/api/devices/${currentId}`, {
                blocklyJS: JSValue,
                blocklyWorkspace: workspaceValue,
            });
            console.log(workspaceValue);
            showAndHidePopup(true);
        }
        catch(err){
            showAndHidePopup(false);
            console.log(err);
        }
    }

    function showAndHidePopup(bool) {
        if(bool){
            showSuccessPopup.value = true;
            setTimeout(() => {
                showSuccessPopup.value = false;
            }, 2000);
        }
        else {
            showFailPopup.value = true;
            setTimeout(() => {
                showFailPopup.value = false;
            }, 2000);
        }
        
    }

    onMounted(async () => {
        await fetchBlockly();
        initializeBlockly();
        loadingWorkspace();
    });

</script>

<template>
    <ToolBox/>
    <div class="blocklyArea">
        <div ref="blocklyDiv" class="neu-box" style="height: 100%; width: 100%;"/>
        <div @click="saveWorkspace" class="neu-box save-btn">Save</div>
        <transition name="fade">
            <div v-if="showSuccessPopup" class="successPopUp">
                <svg xmlns="http://www.w3.org/2000/svg" height="10em" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
            </div>
        </transition>
        <transition name="fade">
            <div v-if="showFailPopup" class="failPopUp">
                <svg xmlns="http://www.w3.org/2000/svg" height="10em" width="10em" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>
            </div>
        </transition>
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

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    .successPopUp {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        fill:var(--color-accent)
    }

    .failPopUp {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        fill:var(--color-accent)
    }
</style>
