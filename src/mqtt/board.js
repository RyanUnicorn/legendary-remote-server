const { client, ...mqtt } = require('./client');
const { WebSocket } = require('ws');

const wss = require('../api/ws');

/**
 * `element = {id, lastSeen, isAvailable}`
 * A list with boards maintained by this server
 */
let availableBoards = [];

/**
 * Push a new Board by boardId
 * @param {*} _id boardId
 */
function pushBoard(_id) {
    const board = {
        id: _id,
        lastSeen: Date.now(),
        isAvailable: true,
    };

    availableBoards.push(board);
}

/**
 * Update availableBoards by boardId
 * @param {*} _id boardId
 * @returns 
 */
function touchAvailableBoards(_id) {
    if (availableBoards.length == 0) {
        pushBoard(_id);
        return;
    }

    let board = availableBoards.find(({id}) => id == _id);
    
    if (!board) {
        pushBoard(board);
        return;
    }

    board.lastSeen = Date.now();
    board.isAvailable = true;
}

/**
 * `dev` boards answer mqtt board discover
 * in this topic.
 */
mqtt.route('dev', (topic, message) => {
    // parsing the message from Buffer to Object
    const boardId = JSON.parse(message.toString()).ID;
    // update availableBoards by the boardId
    touchAvailableBoards(boardId);
});

/**
 * For every n milliseconds, check if the
 * boards is still alive and broadcast to
 * all the ws client.
 */
setInterval(() => {
    // publish mqtt board discover message
    client.publish('dev/discover', 'from NODE server');

    availableBoards.forEach(_board => {
        if (Date.now() - _board.lastSeen > client.BOARD_TIMEOUT) {
            // the board is not available if it's expired
            _board.isAvailable = false;
        }
    });

    // broadcast to all the ws client
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(availableBoards));
        }
    });

}, client.BOARD_INTERVAL);

module.exports = {
    /**
     * availableBoards getter
     * @returns `availableBoards[]`
     */
    getAvailableBoards: () => {
        return availableBoards;
    }

};