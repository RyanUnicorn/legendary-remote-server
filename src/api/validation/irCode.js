const { object, string, } = require('yup');

module.exports = {
    schema: {
        // boardId
        params: object({
            id: string().min(12),
        }),

        // board's name
        body: object({
            name: string(),
        }),
    },
}