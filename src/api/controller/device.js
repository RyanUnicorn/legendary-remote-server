const { device: service } = require('../service');
const { validate: {validate}, MODE } = require('../middleware');
const { device } = require('../validation');

module.exports = {
    listDevices: async (req, res) => {
        try {
            const devices = await service.listDevices();
            res.status(200).send(devices);
        } catch (err) {
            res.status(400).send(err);
        }
    },
    
    // middleware: validate board data
    createDevice: [validate(device.schema, MODE.BODY), async (req, res) => {
        try {
            console.log(req.body);
            const device = await service.createDevice(req.body);
            res.status(200).send(device);
        } catch (err) {
            res.status(400).send(err);
        }
    }],

    // middleware: validate boardId
    getDevice: [validate(device.schema, MODE.PARAM), async (req, res) => {
        try {
            const device = await service.getDevice(req.params);
            res.status(200).send(device);
        } catch (err) {
            res.status(400).send(err);
        }
    }],

    // middleware: validate boardId & board data
    updateDevice: [validate(device.schema, MODE.ALL), async (req, res) => {
        try {
            // assign boardId from params, so that 
            // it can be wrapped into a single object
            req.body.id = req.params.id;
            const device = await service.updateDevice(req.body);
            res.status(200).send(device);
        } catch (err) {            
            res.status(400).send(err);
        }
    }],

    // middleware: validate boardId
    deleteDevice: [validate(device.schema, MODE.PARAM), async (req, res) => {
        try {
            const device = await service.deleteDevice(req.params);
            res.status(200).send(device);
        } catch (err) {            
            res.status(400).send(err);
        }
    }],

}