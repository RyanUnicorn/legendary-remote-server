const { validate: {validate}, MODE } = require('../middleware');
const { board } = require('../validation');
const { board: service } = require('../service');

module.exports = {
    listBoards: async (req, res) => {
        try {
            const _board = await service.listBoards();
            res.status(200).send(_board);
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },

    /**
     * Respond the board paired on success,
     * error message on failed.
     */
    pairBoard: [validate(board.schema, MODE.BODY), async (req, res) => {
        try {
            const _board = await service.pairBoard(req.body);
            res.status(200).send(_board);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }],
    
    // middleware: validate boardId & name
    updateBoard: [validate(board.schema, MODE.ALL), async (req, res) => {
        try {
            const _board = await service.updateBoard({
                id: req.params.id,
                name: req.body.name,
            });
            res.status(200).send(_board);
        } catch (err) {
            res.status(400).send(err);
        }
    }],

    // middleware: validate boardId
    disconnectBoard: [validate(board.schema, MODE.PARAM), async (req, res) => {
        try {
            await service.disconnectBoard({
                id: req.params.id,
            });
            res.status(200).send({message: 'Disconnect the board successfully'});
        } catch (err) {
            res.status(400).send(err);
        }
    }],

    discoverBoard: async (req, res) => {
        const availableBoards = await service.discoverBoard();
        res.status(200).send(availableBoards);
    },
}
