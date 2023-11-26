const { irCode: controller } = require('../controller');

const express = require('express');
const router = express.Router();

router.get('/record', controller.recordIrcode);
router.put('/send', controller.sendIrcode);

module.exports = router;