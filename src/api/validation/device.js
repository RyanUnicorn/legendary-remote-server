const { object, string, number, boolean } = require('yup');

module.exports = {
    schema: {
        // deviceId
        params: object({
            id: number().positive().integer(),
        }),
        // device data
        body: object({
            boardId: string().min(12),
            id: number().positive().integer(),
            name: string(),
            enableUpdate: boolean(),
            blocklyJS: string().nullable(),
            blocklyWorkspace: string().nullable(),
        }),
    },
}