const { device: controller } = require('../controller');

const express = require('express');
const router = express.Router();

router.get('/', controller.listDevices);
router.post('/', controller.createDevice);
router.get('/:id', controller.getDevice);
router.put('/:id', controller.updateDevice);
router.delete('/:id', controller.deleteDevice);

module.exports = router;