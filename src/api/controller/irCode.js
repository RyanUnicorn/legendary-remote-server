const { irCode: service } = require('../service');
const { validate: {validate}, MODE } = require('../middleware');
const { irCode } = require('../validation');

module.exports = {
    createIrcode: [validate(irCode.schema, MODE.BODY),
        async (req, res) => {
            try {
                const irCode = req.body;
                const result = await service.createIrcode(irCode);
                res.status(200).send(result);
            } catch (err) {
                res.status(400).send(err);
            }
        }
    ],

    recordIrcode: [validate(irCode.schema, MODE.BODY),
        async (req, res) => {
            try {
                const board = req.body;
                const irCode = await service.recordIrcode(board);
                res.status(200).send(irCode);
            } catch (err) {
                res.status(400).send(err);
            }
        }
    ],

    sendIrcode: [validate(irCode.schema, MODE.BODY),
        async (req, res) => {
            try {
                const result = await service.sendIrcode(req.body);
                res.status(200).send(result);
            } catch (err) {
                res.status(400).send(err);
            }
        }
    ],
    
    updateIrcode: [validate(irCode.schema, MODE.ALL),
        async (req, res) => {
            try {
                let irCode = req.body;
                irCode.id = req.params.id;
                irCode = await service.updateIrcode(irCode);
                res.status(200).send(irCode);
            } catch (err) {
                res.status(400).send(err);
            }
        }
    ],

    deleteIrcode: [validate(irCode.schema, MODE.PARAM),
        async (req, res) => {
            try {
                const result = await service.deleteIrcode(req.params);
                res.status(200).send(result);
            } catch (err) {
                res.status(400).send(err);
            }
        }
    ],
};