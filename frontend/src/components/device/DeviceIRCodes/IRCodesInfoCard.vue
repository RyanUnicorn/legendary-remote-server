<script setup>
    import { ref } from 'vue';
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
        'saveIRCode'
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

    function saveIRCode(boardId, receiveRawdata){
        emit('saveIRCode', boardId, receiveRawdata, props.IRCodedata.id, props.IRCodedata.deviceId);
    }

</script>

<template>
    <div class="neu-box IRCodesInfoCard">
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
            :text="props.IRCodedata.description"
            :editing="editingDescription"
            @finish="handleEditDescription" 
            class="description"
        />
        <PopUp 
            :isModalOpen = "isPopUp"
            :boardId="props.boardId"
            @close="popUPswitch"
            @saveIRCode="saveIRCode"
            class="PopUp"
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

    .description {
        font-size: 1rem;
        color: var(--color-text-mute);
    }

    .card-dropdown {
        top: 1rem;
        right: 0.5rem;
        position: absolute;
    }

    .PopUp{

    }
</style>