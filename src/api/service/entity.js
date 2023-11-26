const { entity: model } = require('../model');
const { homeAssistant } = require('../mqtt');        

module.exports = {
    /**
     * Add an Entity then publish it to
     * home assistant.
     * @param {*} entity 
     * @returns `entity` that created
     */
    createEntity: async (entity) => {
        // console.log(entity);
        const _entity = await model.createEntity(entity);

        homeAssistant.publishEntity(_entity);

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

        homeAssistant.publishEntity(_entity);

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

        return _entity;
    },
};