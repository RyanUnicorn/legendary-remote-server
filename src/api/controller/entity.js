const { entity: service } = require('../service');
const { validate: {validate}, entity: {selectOptionParser, fanPresetModesParser}, MODE } = require('../middleware');
const { entity } = require('../validation');

module.exports = {
    // middleware: validate entity data
    createEntity: [validate(entity.schema, MODE.BODY), selectOptionParser, fanPresetModesParser,
        async (req, res) => {
            try {
                let entity = req.body;

                // entity type must be specify when creating an entity
                if (!entity.type) {
                    throw new Error('Entity type must be specify').toString();
                }

                entity = await service.createEntity(entity);
                res.status(200).send(entity);
            } catch (err) {
                res.status(400).send(err);
            }
        }
    ],

    // middleware: validate entityId & entity data
    updateEntity: [validate(entity.schema, MODE.ALL), selectOptionParser,
        async (req, res) => {
            try {
                let entity = req.body;

                // assign entityId from params to body
                entity.id = req.params.id;

                entity = await service.updateEntity(entity);
                res.status(200).send(entity);
            } catch (err) {
                res.status(400).send(err);
            }
        }
    ],

    // middleware: validate entityId
    deleteEntity: [validate(entity.schema, MODE.PARAM), async (req, res) => {
        try {
            // assign entityId from params to body
            let entity = req.params;

            entity = await service.deleteEntity(entity);
            res.status(200).send(entity);
        } catch (err) {
            res.status(400).send(err);
        }
    }],
};