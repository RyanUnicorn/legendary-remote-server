const { entity: model, device: {updateDevice} } = require('../model');
const { homeAssistant } = require('../../mqtt');

module.exports = {
    /**
     * Add an Entity then publish it to
     * home assistant.
     * @param {*} entity 
     * @returns `entity` that created
     */
    createEntity: async (entity) => {
        const _entity = await model.createEntity(entity);

        homeAssistant.configHAEntity(_entity);
        homeAssistant.subCmndTopic({id: _entity.deviceId});

        return _entity;
    },

    /**
     * Update an Entity then publish it to
     * home assistant.
     * @param {*} entity 
     * @returns `entity` that updated
     */
    updateEntity: async (entity) => {
        const _entity = await model.updateEntity(entity);

        homeAssistant.configHAEntity(_entity);

        return _entity;
    },

    /**
     * Delete an Entity then publish it to
     * home assistant.
     * @param {*} entity 
     * @returns 
     */
    deleteEntity: async (entity) => {
        const _entity = await model.deleteEntity(entity);

        homeAssistant.deleteEntity(_entity);

        const device = {
            id: _entity.deviceId,
            blocklyJS: '',
        }
        await updateDevice(device);

        return _entity;
    },
};