const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({path: '/ws', noServer: true});

wss.on('connection', (ws, request) => {
    ws.on('error', console.error);
    ws.on('message', (message) => {
        // console.log(message.toString());
    });
});

module.exports = wss;