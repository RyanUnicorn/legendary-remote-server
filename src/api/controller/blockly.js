const { validate: {validate}, MODE } = require('../middleware');
const { device } = require('../validation');
const { blockly: service } = require('../service')

module.exports = {
    getAllBlocklyData: [validate(device.schema, MODE.PARAM), async (req, res) => {
        try {
            const blocklyDatas = await service.getAllBlocklyData(req.params.id);
            res.status(200).send(blocklyDatas);
        } catch(err) {
            res.status(404).send(err);
        }
    }],
};