const { irCode: service } = require('../service');
const { validate: {validate}, MODE } = require('../middleware');
const { entity } = require('../validation');

module.exports = {
    recordIrcode: [async (req, res) => {
        try {
            const board = req.body;
            const irCode = await service.recordIrcode(board);
            res.status(200).send(irCode);
        } catch (err) {
            res.status(400).send(err);
        }
    }],

    sendIrcode: [async (req, res) => {
        try {
            const result = await service.recordIrcode(req.body);
            res.status(200).send(result);
        } catch (err) {
            res.status(400).send(err);
        }
    }],
};