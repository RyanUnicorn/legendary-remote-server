const { client, ...mqtt } = require('./client');

const IR_PREFIX = 'ir';
const IR_DUMP = 'dump';
const IR_RECV = 'recv';
const IR_SENDRAW = 'sendraw';
const IR_SENT = 'sent';

module.exports = {
    /**
     * Receive an IR code.
     * @param {*} boardId 
     * @returns a Promise that resolve on board's
     * `recv` reply
     */
    recvDump: async (boardId) => new Promise((resolve, reject) => {
        client.publish(`${IR_PREFIX}/${boardId}/${IR_DUMP}/start`);

        mqtt.route(`${IR_PREFIX}/${boardId}/${IR_RECV}`, (topic, message) => {

            client.publish(`${IR_PREFIX}/${boardId}/${IR_DUMP}/stop`);
            mqtt.unroute(`${IR_PREFIX}/${boardId}/${IR_RECV}`);

            resolve(message.toString());
        });
    }),

    /**
     * Send an IR raw data.
     * @returns a Promise that resolve on board's
     * `sent` reply
     */
    sendRaw: async ({boardId, irCode}) => new Promise((resolve, reject) => {
        const payload = JSON.stringify(irCode);
        client.publish(`${IR_PREFIX}/${boardId}/${IR_SENDRAW}`, payload);

        setTimeout(() => {
            mqtt.unroute(`${IR_PREFIX}/${boardId}/${IR_SENT}`);
            reject(new Error(''));
        }, client.BOARD_INTERVAL);

        mqtt.route(`${IR_PREFIX}/${boardId}/${IR_SENT}`, (topic, message) => {
            message = JSON.parse(message.toString());
            if (message.code == irCode.code) {
                mqtt.unroute(`${IR_PREFIX}/${boardId}/${IR_SENT}`);
                resolve(message);
            }
        });
    }),
};