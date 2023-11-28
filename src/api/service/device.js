const { device: model } = require('../model');

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
        return await model.updateDevice(device);
    },

    deleteDevice: async (device) => {
        return await model.deleteDevice(device);
    },
};