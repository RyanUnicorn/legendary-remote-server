const { board: controller } = require('../controller');
// const boardCtrler = controller.board;

const express = require('express');
const router = express.Router();

/**
 * prefix: `/api/boards`
 */
router.get('/', controller.listBoards);
router.post('/', controller.pairBoard);
router.put('/:id', controller.updateBoard);
router.delete('/:id', controller.disconnectBoard);
router.get('/discover', controller.discoverBoard);

module.exports = router;