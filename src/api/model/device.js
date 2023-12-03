const { json } = require('express');
const prisma = require('./client');
const { ENTITY_TYPES } = require('./entity');

module.exports = {
    /**
     * List all the devices.
     */
    listDevices: async () => {

        let _devices = await prisma.device.findMany({
            include: {
                entities: { include: ENTITY_TYPES },
                irCodes: true,
            },
        });

        // delete all the other null element inside 
        // the each element that is not it's subtype.
        const _entityTypes = Object.keys(ENTITY_TYPES);
        _devices.forEach(({entities}) => {
            entities.forEach((entity) => {
                _entityTypes.forEach((_entityType) => {
                    if (_entityType != entity.type) {
                        delete entity[_entityType];
                    }
                });
            });
        });


        return _devices; 
    },

    /**
     * Create a device.
     */
    createDevice: async (device) => {
        const _device = await prisma.device.create({
            data: device,
        });

        return _device;
    },

    /**
     * Get a single device with deviceId.
     * @param {*} `_id` deviceId
     */
    getDevice: async ({id: _id}) => {

        const _device = await prisma.device.findUnique({
            where: {id: _id},
            include: {
                entities: { include: ENTITY_TYPES },
                irCodes: true,
            },
        });

        _device.irCodes.forEach((irCode)=>{
            irCode.rawData = JSON.parse(irCode.rawData);
        });
        
        return _device;
    },

    /**
     * Update a device where field[`id`] matches
     */
    updateDevice: async (device) => {
        const _device = await prisma.device.update({
            where: {
                id: device.id,
            },
            data: device,
            include: {
                entities: { include: ENTITY_TYPES },
            },
        });

        return _device;
    },

    /**
     * Delete a device with deviceId
     * @param {*} `_id` deviceId
     */
    deleteDevice: async ({id: _id}) => {
        const _device = await prisma.device.delete({
            where: {id: _id},
            include: {
                entities: { include: ENTITY_TYPES },
            },
        });

        return _device;
    },
};