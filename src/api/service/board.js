const { Prisma } = require('@prisma/client');
const { board: model } = require('../model');
const { board: mqtt, irCode: { setBoardHandler } } = require('../../mqtt');

module.exports = {
    listBoards: async () => {
        // Get boards from db.
        let boards = await model.listBoards();
        // available board list
        const availableBoards = mqtt.getAvailableBoards();

        // Tag each boards' isAvailable with status
        boards.forEach((board) => {
            // search for the available board list
            const _board = availableBoards.find(({id: _id}) => _id == board.id);
            board.isAvailable = _board?.isAvailable ? true : false;
        });

        return boards;
    },

    pairBoard: async ({id: _id, name: _name}) => {
        const availableBoards = mqtt.getAvailableBoards();
        
        // Check if the board is available.
        const board = availableBoards.find(({id}) => id == _id);
        
        // console.log(board, board.isAvailable);
        if (!board) {
            throw new Error(`The board trying to paired is unavailable.`);
        }

        /**
         * A wrapper try-catch block to modify the
         * error message from `Unique constraint
         * failed on the fields: (`id`)` into 
         * `The board is already paired.`
         */
        try {
            const _board = await model.addBoard({id: _id, name: _name});
            setBoardHandler(_board.id);
            return _board;
        } catch (err) {
                // Check if the error type is same as unique key
                // constriant's error.
            if (err instanceof Prisma.PrismaClientKnownRequestError
                // Check error code.
                && err?.code == 'P2002' 
                // Check if it has column 'id'
                && err?.meta?.target?.find((element) => element == 'id')) {
                    // A new error message
                    throw new Error(`The board is already paired.`);
            }

            // Else just throw the error as usual.
            throw err;
        }

    },
    
    updateBoard: async ({id, name}) => {
        return await model.updateBoard({id, name});
    },

    disconnectBoard: async ({id}) => {
        await model.deleteBoard({id});
    },
    
    discoverBoard: async () => {
        return mqtt.getAvailableBoards();
    }
};