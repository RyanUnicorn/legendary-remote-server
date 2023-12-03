const { blockly: controller } = require('../controller');

const express = require('express');
const router = express.Router();

router.get('/:id', controller.getAllBlocklyData);

module.exports = router;