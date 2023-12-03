<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    import { globals } from '../../../main';
    import DropDown from '../../shared/DropDown.vue';
    import EditableText from '../../shared/EditableText.vue';
    import PopUp from './IRCodePopUp.vue';

    const options = ['Rename', 'Redescribe', 'Record', 'Delete'];

    const props = defineProps([
        'IRCodedata',
        'boardId'
    ]);

    const emit = defineEmits([
        'rename',
        'redescribe',
        'delete',
        'saveInfoIRCode'
    ])

    const editingName = ref(false);
    const editingDescription = ref(false);

    function handleSelected(option) {
        switch(option) {
            case 'Rename':
                editingName.value = true;
                break;
            case 'Redescribe':
                editingDescription.value = true;
                break;
            case 'Delete':
                emit('delete', props.IRCodedata.id);
                break;
            case 'Record':
                popUPswitch();
                break;
        }
    }

    async function sendIRCode(){
        try {
        await axios.put(`${globals.$origin}/api/ircodes/send`, {
            code: props.IRCodedata.code,
            rawData: props.IRCodedata.rawData,
            boardId: props.boardId,
        });
        } catch(err) {
            console.error(err);
        }
    }

    function handleEditName(editedName, content) {
        if(editedName) {
            emit('rename', props.IRCodedata.id, content);
        }
        editingName.value = false;
    }

    function handleEditDescription(editedDescription, content) {
        if(editedDescription) {
            emit('redescribe', props.IRCodedata.id, content);
        }
        editingDescription.value = false;
    }

    const isPopUp = ref(false);

    function popUPswitch(){
        isPopUp.value = !isPopUp.value;
    }

    function saveInfoIRCode(boardId, receiveRawdata, receiveCode){
        emit('saveInfoIRCode', boardId, receiveRawdata, receiveCode, props.IRCodedata.id, props.IRCodedata.deviceId);
    }

</script>

<template>
    <div class="neu-box IRCodesInfoCard">
        <div @click="sendIRCode" v-if="!(editingDescription || editingName)" class="sendIR"></div>
        <DropDown class="card-dropdown"
            :options="options"
            @selected="handleSelected"
        />
        <EditableText
            :text="props.IRCodedata.name"
            :editing="editingName"
            @finish="handleEditName"
        />
        <EditableText
            :adaptive-width="true"
            :text="props.IRCodedata.description"
            :editing="editingDescription"
            @finish="handleEditDescription" 
            class="description"
        />
        <PopUp 
            :isModalOpen = "isPopUp"
            :boardId="props.boardId"
            @close="popUPswitch"
            @saveIRCode="saveInfoIRCode"
        />
    </div>
</template>

<style scoped>
    .IRCodesInfoCard {
        padding: var(--spacing-const);
        position: relative;
        scroll-snap-align: start;
        width: 100%;
        height: 30%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        transition: 200ms;
        fill: v-bind(color);
        font-size: 1.5rem;
        color: var(--color-text);

        &:hover {
            color: var(--color-accent);
            fill: var(--color-accent);
            box-shadow:  7px  7px 20px #bebebe,
                        -9px -9px 20px #ffffff;
        }
    }

    .sendIR {
        padding: var(--spacing-const);
        position: absolute;
        display: flex;
        right: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        opacity: 0;
        transition: opacity 200ms;

        &:hover {
            opacity: 1;
        }

        &::before {
            position: absolute;
            bottom: 11px;
            background-color: var(--color-background);
            color: var(--color-accent);
            font-size: 1rem;
            content: 'Press to send IRCode.';
            opacity: 0;
            transition: opacity 200ms;
        }

        &:hover::before {
            opacity: 1;
        }
    }


    .description {
        font-size: 1rem;
        color: var(--color-text-mute);
    }

    .card-dropdown {
        top: 1rem;
        right: 0.5rem;
        position: absolute;
    }

</style>