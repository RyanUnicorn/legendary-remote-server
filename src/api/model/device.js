const prisma = require('./client');
const { ENTITY_TYPES } = require('./entity');

module.exports = {
    /**
     * List all the devices.
     */
    listDevices: async () => {
        let includes = {irCodes: true};
        Object.assign(includes, ENTITY_TYPES);

        let _devices = await prisma.device.findMany({
            include: {
                entities: { include: includes },
            },
        });

        // delete all the other null element inside 
        // the each element that is not it's subtype.
        const _entityTypes = Object.keys(ENTITY_TYPES);
        _devices.forEach(({entities}) => {
            entities.forEach((entity) => {
                _entityTypes.forEach((_entityType) => {
                    if (_entityType != entity.type) {
                        delete entity[_entityType];
                    }
                });
            });
        });


        return _devices; 
    },

    /**
     * Create a device.
     */
    createDevice: async (device) => {
        const _device = await prisma.device.create({
            data: device,
        });

        return _device;
    },

    /**
     * Get a single device with deviceId.
     * @param {*} `_id` deviceId
     */
    getDevice: async ({id: _id}) => {
        let includes = {irCodes: true};
        Object.assign(includes, ENTITY_TYPES);

        const _device = await prisma.device.findUnique({
            where: {id: _id},
            include: {
                entities: { include: includes },
                // irCodes: true,
            },
        });

        return _device;
    },

    /**
     * Update a device where field[`id`] matches
     */
    updateDevice: async (device) => {
        const _device = await prisma.device.update({
            where: {
                id: device.id,
            },
            data: device,
        });

        return _device;
    },

    /**
     * Delete a device with deviceId
     * @param {*} `_id` deviceId
     */
    deleteDevice: async ({id: _id}) => {
        const _device = await prisma.device.delete({
            where: {id: _id},
        });

        return _device;
    },
};