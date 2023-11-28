const { irCode: controller } = require('../controller');

const express = require('express');
const router = express.Router();

router.post('/', controller.createIrcode);
router.get('/record/:boardId', controller.recordIrcode);
router.put('/send', controller.sendIrcode);
router.put('/:id', controller.updateIrcode);
router.delete('/:id', controller.deleteIrcode);

module.exports = router;