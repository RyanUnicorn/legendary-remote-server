const { device: model } = require('../model');
const { homeAssistant } = require('../../mqtt');

module.exports = {
    listDevices: async () => {
        return await model.listDevices();
    },

    createDevice: async (device) => {
        return await model.createDevice(device);
    },

    getDevice: async (device) => {
        return await model.getDevice(device);
    },

    updateDevice: async (device) => {
        device = await model.updateDevice(device);

        device.entities.forEach((_entity) => {
            homeAssistant.configHAEntity(_entity);
        });

        return device;
    },

    deleteDevice: async (device) => {
        const toDelDevice = await model.getDevice({id: device.id});
        const toDelEntities = toDelDevice.entities;

        for(_entity of toDelEntities) {
            await homeAssistant.deleteEntity(_entity);
        }
        
        device = await model.deleteDevice(device);

        return device;
    },
};