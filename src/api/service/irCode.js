const { irCode: mqtt } = require('../../mqtt');
const { irCode: model } = require('../model');

module.exports = {
    createIrcode: async (irCode) => {
        // `rawData` is a string in db
        irCode.rawData = JSON.stringify(irCode.rawData);
        irCode = await model.createIrcode(irCode);
        
        return irCode;
    },

    recordIrcode: async ({boardId}) => {
        return await mqtt.recvDump(boardId);
    },

    sendIrcode: async ({boardId, ...irCode}) => {
        return await mqtt.sendRaw({boardId, irCode});
    },

    updateIrcode: async (irCode) => {
        // `rawData` is a string in db
        if (irCode.rawData) {
            irCode.rawData = JSON.stringify(irCode.rawData);
        }
        irCode = await model.updateIrcode(irCode);

        return irCode;
    },

    deleteIrcode: async (irCode) => {
        irCode = await model.deleteIrcode(irCode);

        return irCode;
    },
};