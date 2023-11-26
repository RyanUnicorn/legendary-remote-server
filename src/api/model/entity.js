const prisma = require('./client');

const ENTITY_TYPES = { 
    switch: true, 
    select: true,
    button: true,
    number: true,
};


module.exports = {
    // constant of entity types
    ENTITY_TYPES,
    
    /**
     * Create an entity.
     * @param {*} entity 
     * @returns the Entity just created.
     */
    createEntity: async (entity) => {
        // the tables that includes in returns.
        const {...includeTables} = ENTITY_TYPES;
        includeTables.device = true;
        
        // using prisma's `create` API
        entity[entity.type] = {create: entity[entity.type]};

        return await prisma.entity.create({
            data: entity,
            include: includeTables,
        });
    },

    /**
     * Update the entity by entityId.
     * @param {*} entity 
     * @returns the entity just updated
     */
    updateEntity: async (entity) => {
        // the tables that includes in returns.
        const {...includeTables} = ENTITY_TYPES;
        includeTables.device = true;

        // using prisma's `update` API
        if (entity.type) {
            entity[entity.type] = {
                update: {
                    data: entity[entity.type],
                }
            };
        }

        return await prisma.entity.update({
            where: { id: entity.id },
            data: entity,
            include: includeTables,
        });
    },

    /**
     * Delete the entity by entityId.
     * @param {*} id entityId
     * @returns the entity just deleted
     */
    deleteEntity: async ({id: _id}) => {
        return await prisma.entity.delete({
            where: {
                id: _id
            }
        });
    }
};