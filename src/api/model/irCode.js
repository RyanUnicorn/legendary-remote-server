const prisma = require('./client');

module.exports = {
    createIrcode: async (irCode) => {
        return await prisma.irCode.create({
            data: irCode,
        });
    },

    getIrcode: async ({id}) => {
        return await prisma.irCode.findUnique({
            where: { id },
        });
    },

    updateIrcode: async (irCode) => {
        return await prisma.irCode.update({
            where: { id: irCode.id },
            data: irCode,
        });

    },

    deleteIrcode: async ({id}) => {
        return await prisma.irCode.delete({
            where: { id },
        });

    }
};