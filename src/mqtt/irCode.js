const { client, ...mqtt } = require('./client');
const { board: {listBoards}, board, irCode } = require('../api/model');

const IR_PREFIX = 'ir';
const IR_DUMP = 'dump';
const IR_RECV = 'recv';
const IR_SENDRAW = 'sendraw';
const IR_SENT = 'sent';

const QUEUE = {
    timeout: 250,
    retries: 3,
}

let sendingQueue = {};

async function init() {
    const boards = await listBoards();
    boards.forEach((_board) => {
        setBoardHandler(_board.id);
    });
    console.log(sendingQueue);
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
            // .then(irCode.sent)
            // .catch(irCode.failed)
            // .finally(() => {
            //     mqtt.unroute(`${IR_PREFIX}/${boardId}/${IR_SENT}`);
            // });
    } catch (error) {
        console.error(error);
    }

    if (--irCode.retries <= 0) {
        sendingQueue[boardId].queue.shift();
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
    return new Promise(async (resolve, reject) => {
        // insert into sending queue
        Object.assign(irCode, {
            boardId: boardId,
            retries: QUEUE.retries,
            sent: resolve,
            fialed: reject,
        });
        sendingQueue[boardId].queue.push(irCode);
        sendingQueue[boardId].start();
    })
}

(async () => {
    await init();
})();

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

    // /**
    //  * Send an IR raw data.
    //  * Timeout 1.5 seconds.
    //  * @returns a Promise that resolve on board's
    //  * `sent` reply
    //  */
    // sendRaw: async ({boardId, irCode}) => new Promise((resolve, reject) => {
    //     const payload = JSON.stringify(irCode);
    //     client.publish(`${IR_PREFIX}/${boardId}/${IR_SENDRAW}`, payload);

    //     const timeout = new Promise((resolve, reject) => {
    //         setTimeout(reject, client.BOARD_INTERVAL, 'timeout');
    //     });

    //     const sent = new Promise((resolve, reject) => {
    //         mqtt.route(`${IR_PREFIX}/${boardId}/${IR_SENT}`, (topic, message) => {
    //             message = JSON.parse(message.toString());
    //             if (message.code == irCode.code) {
    //                 resolve(message);
    //             }
    //         });
    //     });

    //     // race and see which is faster, sent or timeout.
    //     Promise.race([timeout, sent])
    //         .then(resolve)
    //         .catch(reject)
    //         // default ruroute and let the board stop dumping.
    //         .finally(() => {
    //             mqtt.unroute(`${IR_PREFIX}/${boardId}/${IR_SENT}`);
    //         });
    // }),

    sendRaw,
};

