const { getAllState, getAllConst, getAllIrCode } = require('../../mqtt/blocklyManager');

async function getAllBlocklyData(deviceId) {
    const [ states, { consts, boardId }, irCodes ]
        = await Promise.all([getAllState(deviceId), getAllConst(deviceId), getAllIrCode(deviceId)]);

    return {
        states,
        consts,
        irCodes,
    };
}

module.exports = {
    getAllBlocklyData,
};