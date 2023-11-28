const { object, number, string, array } = require('yup');

module.exports = {
    schema: {
        // ircodeId
        params: object({
            id: number().positive().integer(),
            boardId: string().length(12).uppercase().matches(/^[0-F]{12}$/),
        }),

        // ircode data
        body: object({
            boardId: string().length(12).uppercase().matches(/^[0-F]{12}$/),
            deviceId: number().positive().integer(),
            name: string(),
            description: string(),
            code: string().transform((value) => {
                return `0x${value.substr(2).toUpperCase()}`
            }).matches(/^0x[0-F]+$/i),
            rawData: array().of(number().integer().positive()),
        }),
    },
}