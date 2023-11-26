const { irCode: service } = require('../mqtt');

module.exports = {
    recordIrcode: async ({boardId}) => {
        return await service.recvDump(boardId);
    },

    recordIrcode: async ({boardId, ...irCode}) => {
        return await service.sendRaw({boardId, irCode});
    },
};