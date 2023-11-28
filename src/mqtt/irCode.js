const { client, ...mqtt } = require('./client');

const IR_PREFIX = 'ir';
const IR_DUMP = 'dump';
const IR_RECV = 'recv';
const IR_SENDRAW = 'sendraw';
const IR_SENT = 'sent';

module.exports = {
    /**
     * Receive an IR code.
     * Timeout 10 seconds.
     * @param {*} boardId 
     * @returns a Promise that resolve on board's
     * `recv` reply
     */
    recvDump: async (boardId) => new Promise((resolve, reject) => {
        client.publish(`${IR_PREFIX}/${boardId}/${IR_DUMP}/start`);

        const timeout = new Promise((resolve, reject) => {
            setTimeout(reject, client.RECV_TIMEOUT, 'timeout');
        });

        const recv = new Promise((resolve, reject) => {
            mqtt.route(`${IR_PREFIX}/${boardId}/${IR_RECV}`, (topic, message) => {
                resolve(message.toString());
            });
        });

        // race and see which is faster, recv or timeout.
        Promise.race([timeout, recv])
            .then(resolve)
            .catch(reject)
            // default ruroute and let the board stop dumping.
            .finally(() => {
                client.publish(`${IR_PREFIX}/${boardId}/${IR_DUMP}/stop`);
                mqtt.unroute(`${IR_PREFIX}/${boardId}/${IR_RECV}`);
            });
    }),

    /**
     * Send an IR raw data.
     * Timeout 1.5 seconds.
     * @returns a Promise that resolve on board's
     * `sent` reply
     */
    sendRaw: async ({boardId, irCode}) => new Promise((resolve, reject) => {
        const payload = JSON.stringify(irCode);
        client.publish(`${IR_PREFIX}/${boardId}/${IR_SENDRAW}`, payload);

        const timeout = new Promise((resolve, reject) => {
            setTimeout(reject, client.BOARD_INTERVAL, 'timeout');
        });

        const sent = new Promise((resolve, reject) => {
            mqtt.route(`${IR_PREFIX}/${boardId}/${IR_SENT}`, (topic, message) => {
                message = JSON.parse(message.toString());
                if (message.code == irCode.code) {
                    resolve(message);
                }
            });
        });

        // race and see which is faster, sent or timeout.
        Promise.race([timeout, sent])
            .then(resolve)
            .catch(reject)
            // default ruroute and let the board stop dumping.
            .finally(() => {
                mqtt.unroute(`${IR_PREFIX}/${boardId}/${IR_SENT}`);
            });
    }),
};