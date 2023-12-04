const { client, ...mqtt } = require('./client');
const { board: {listBoards}, board, irCode } = require('../api/model');

const IR_PREFIX = 'ir';
const IR_DUMP = 'dump';
const IR_RECV = 'recv';
const IR_SENDRAW = 'sendraw';
const IR_SENT = 'sent';

const QUEUE = {
    defaultInterval: 50,
    timeout: 250,
    retries: 3,
}

/**
 * This is a helper function to delay for a set amount of ms, better use with await
 * @param {*} ms milliseconds to delay
 * @returns 
 */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let sendingQueue = {};

async function init() {
    const boards = await listBoards();
    boards.forEach((_board) => {
        setBoardHandler(_board.id);
    });
}

async function loop(boardId) {
    if (!sendingQueue[boardId]?.queue?.length) {
        sendingQueue[boardId].isLooping = false;
        return;
    }
    
    const irCode = sendingQueue[boardId].queue[0];
    
    // console.log(sendingQueue[boardId]);

    const payload = JSON.stringify(irCode);
    client.publish(`${IR_PREFIX}/${boardId}/${IR_SENDRAW}`, payload);

    const timeout = new Promise((resolve, reject) => {
        setTimeout(reject, QUEUE.timeout, 'timeout');
    });

    const sent = new Promise((resolve, reject) => {
        mqtt.route(`${IR_PREFIX}/${boardId}/${IR_SENT}`, (topic, message) => {
            message = JSON.parse(message.toString());
            if (message.code == irCode.code) {
                sendingQueue[boardId].queue.shift();
                resolve(message);
            }
        });
    });

    try {
        const result = await Promise.race([timeout, sent])
        irCode.sent(result);
        mqtt.unroute(`${IR_PREFIX}/${boardId}/${IR_SENT}`);
        await delay(irCode.irSendInterval);
    } catch (error) {
        irCode.failed(error);
    }

    if (--irCode.retries <= 0) {
        sendingQueue[boardId].queue.forEach((_irCode) => {
            mqtt.unroute(`${IR_PREFIX}/${boardId}/${IR_SENT}`);
            _irCode.failed('timeout');
        });
        sendingQueue[boardId].queue = [];
    }
    // console.log(sendingQueue[boardId].queue);
    loop(boardId);
}

function setBoardHandler(boardId) {
    sendingQueue[boardId] = {};

    Object.assign(sendingQueue[boardId], {
        queue: [],
        isLooping: false,
        start: () => {
            if (sendingQueue[boardId].isLooping) return;
            sendingQueue[boardId].isLooping = true;
            loop(boardId);
        }
    });
}

/**
     * Send an IR raw data.
     * Timeout 1.5 seconds.
     * @returns a Promise that resolve on board's
     * `sent` reply
     */
async function sendRaw({boardId, irCode}) {
    /**
     * Check if the irCode has property 'irSendInterval' if not
     * set it to the default value, this avoid problems if an 
     * irCode has no 'irSendInterval' (like when irCode service
     * wants to send a raw data from the frontend)
     */
    if(irCode.irSendInterval == undefined) {
        irCode.irSendInterval = QUEUE.defaultInterval;
    }
    return new Promise(async (resolve, reject) => {
        // insert into sending queue
        Object.assign(irCode, {
            boardId: boardId,
            retries: QUEUE.retries,
            sent: resolve,
            failed: reject,
        });
        sendingQueue[boardId].queue.push(irCode);
        sendingQueue[boardId].start();
    })
}

async function sendRawList(boardId, irCodes) {
    let sendList = [];
    irCodes.forEach((_irCode) => {
        sendList.push(sendRaw({boardId, irCode: _irCode}));
    });

    return await Promise.all(sendList);
}

module.exports = {
    init,
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

    sendRaw,
    sendRawList,
    setBoardHandler,
};

