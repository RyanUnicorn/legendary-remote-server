const prisma = require('./client');

module.exports = {
    /**
     * List all boards in DB
     * @returns `[boards...]`
     */
    listBoards: async () => {
        const _board = await prisma.board.findMany();
        return _board;
    },

    /**
     * Get the board's info with boardId
     * @param {id} `boardId` 
     * @returns `board`
     */
    getConnectedBoard: async ({id}) => {
        const _board = await prisma.board.findUniqueOrThrow({
            where: {
                id: id,
            }
        });

        return _board;
    },

    /**
     * Add a new board into DB.
     * @param {*} `id`: boardId `name`: name of the board
     * @returns `board` the board added
     */
    addBoard: async ({id: _id, name: _name}) => {
        const _board = await prisma.board.create({
            data: {
                id: _id,
                name: _name,
            }
        });

        return _board;
    },

    /**
     * Update the board with boardId
     * @param {*} `id`: boardId `name`: name of the board 
     * @returns `board` the board updated
     */
    updateBoard: async ({id, name}) => {
        const _board = await prisma.board.update({
            where: {
                id: id,
            },
            data: {
                name: name,
            }
        });

        return _board;
    },

    /**
     * Delete a paired board by boardId
     * @param {*} `id`: boardId
     * @returns `null` on success,
     * error message if failed
     */
    deleteBoard: async ({id}) => {
        const _board = await prisma.board.delete({
            where: {
                id: id
            }
        });

        return _board;
    },

    
};