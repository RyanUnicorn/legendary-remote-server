const { entity: controller } = require('../controller');

const express = require('express');
const router = express.Router();

router.post('/', controller.createEntity);
router.put('/:id', controller.updateEntity);
router.delete('/:id', controller.deleteEntity);

module.exports = router;