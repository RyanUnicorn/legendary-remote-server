const http = require('http');
const express = require('express');
const app = express();

const middleware = require('./api/middleware');
const cors = require('cors');

const router = express.Router();
const apiRouter = require('./api/router');

const wss = require('./api/ws');

const { homeAssistant, irCode } = require('./mqtt');

require('dotenv').config({path: '../.env'});

// body json parser
app.use(express.json());
// 
app.use(middleware.dev.showReqInfo({method: true, path: true}));

// configure CORS
if (process.env.NODE_ENV != 'production') {
    const corsConfig = {
        origin: 'http://localhost:5173',
    };
    app.use(cors(corsConfig));
}

// `/api` prefix
app.use('/api', router);
// APIs
router.use('/boards', apiRouter.board);
router.use('/devices', apiRouter.device);
router.use('/entities', apiRouter.entity);
router.use('/ircodes', apiRouter.irCode);
router.use('/blockly', apiRouter.blockly);

// server the built front end
const path = require('path');
app.use(express.static('./public'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

homeAssistant.init();
irCode.init();

/**
 * TODO: split dev server & release server
*/
let serverInfo, scheme, host, port;

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running @ http://localhost:${PORT}`);
});

// const server = http.createServer(app);

// server.on('upgrade', (request, socket, head) => {
//     socket.on('error', console.error);

//     wss.handleUpgrade(request, socket, head, (ws) => {
//         wss.emit('connection', ws, request);
//     });
// });

// server.listen(port, () => {
//     console.log(`${serverInfo} @ ${scheme}://${host}:${port}`);
// });
