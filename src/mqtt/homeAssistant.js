const { client, ...mqtt } = require('./client');
const { sendRaw } = require('./irCode');
const { irCode: model, entity: {listEntities} } = require('../api/model');
const { device } = require('../api/validation');


const DISCOVERY_PREFIX = 'homeassistant';
const DISCOVERY_SUFIX = 'config';
const ENTITY_PREFIX = 'entity';
const COMMAN_SUFIX = 'cmnd';
const STATE_SUFIX = 'state';

/**
 * Home Assistant's MQTT topics builder.
 * See link down below `DISCOVERY MESSAGES`/`Discovery topic` section,
 * or `Entity integrations supported by MQTT discovery` section.
 * @link https://www.home-assistant.io/integrations/mqtt/#mqtt-discovery
 * @returns A topic.
 */
const TOPIC = {
    discovery: (entity) => 
        `${DISCOVERY_PREFIX}/${entity.type}/${entity.id}/${DISCOVERY_SUFIX}`,
    
    command: (entity) =>
        `${ENTITY_PREFIX}/${entity.deviceId}/${entity.id}/${COMMAN_SUFIX}`,

    state: (entity) =>
        `${ENTITY_PREFIX}/${entity.deviceId}/${entity.id}/${STATE_SUFIX}`,

}

/**
 * Convert the the entity of our server into
 * Home Assistant's device/entity format.
 * See link down below `Entity integrations supported by
 * MQTT discovery` section.
 * @link https://www.home-assistant.io/integrations/mqtt/#mqtt-discovery
 * @param {*} entity our entity object
 * @returns JSON string that Home Assistant's 
 * MQTT discovery payload required.
 */
function discoveryPayload(entity) {
    // an alias that shorten the code
    const _ = entity;

    // output entity
    let _entity = {
        name: _.name,
        icon: _.icon ? _.icon : undefined,
        unique_id: _.id,
        command_topic: TOPIC.command(_),
        state_topic: TOPIC.state(_),
        // ? Maybe we'll use it someday.
        // availability:
        //     {
        //         topic: `${ENTITY_PREFIX}/${_.deviceId}/${_.id}/isAvailable`,
        //         payload_available: 'true',
        //         payload_not_available: 'false',
        //     },
        device: {
            identifiers: _.deviceId,
            name: _.device.name,
        },
    };

    /**
     * an object that contains additional keys
     * depends on different entity subtypes.
     * See link down below `Entity integrations supported by
     * MQTT discovery` section.
     * @link https://www.home-assistant.io/integrations/mqtt/#mqtt-discovery
     */
    let additionalKeys = {};

    switch (_.type) {
        case 'switch':
            additionalKeys = {
                payload_on: 'on',
                payload_off: 'off',
                state_on: 'true',
                state_off: 'false',
            };

            break;

        case 'select':
            // `select`.`options` needs to be parsed into an Array
            additionalKeys = {
                options: JSON.parse(_.select.options),
            };

            break;

        case 'button':
            additionalKeys = {
                payload_press: JSON.stringify({
                    state: 'pressed',
                }),
            };

            break;

        case 'number':
            additionalKeys = {
                min: _.number.min,
                max: _.number.max,
                step: _.number.step,
                mode: _.number.isSlider ? 'slider' : 'box',
            };

            break;

        default:
            break;
    }

    // add the additional keys into
    // the output entity.
    Object.assign(_entity, additionalKeys);

    return _entity;
}

/**
 * TODO: Maybe it should be in blockly
 */
const routeCmndTopic = async (topic) => mqtt.route(topic, async (topic, message) => {
    console.log(topic);
    // const parsedTopic = topic.match(/dev\/([0-F]{12})\/(\d+)\/cmnd\/?(\w+)?/);
    // let irCode = {
    //     entityId: parseInt(parsedTopic[2]),
    //     topicSufix: parsedTopic[3] ? parsedTopic[3] : '',
    // }
    // const boardId = parsedTopic[1];
    // irCode = await model.getIrcode(irCode);
    // if (!irCode) {
    //     throw new Error('123');
    // }
    // irCode.rawData = JSON.parse(irCode.rawData);
    // await sendRaw({boardId, irCode});
    /**
     * TODO: Blockly
     * @return state topic
     */
});

/**
 * Publish the entity to let Home Assistant
 * add it into the integration.
 * @param {*} entity 
 */
const publishEntity = (entity) => {
    // build the topic
    const topic = TOPIC.discovery(entity);
    // build the payload
    const payload = discoveryPayload(entity);

    client.publish(topic, JSON.stringify(payload));
};

/**
 * Publish an entity to Home Assistant
 * then subscribe to it's command topics.
 * @param {*} entity 
 */
const configHAEntity = (entity) => {
    publishEntity(entity);
    // TODO: should support FAN, HVAC...
    
    // Publish entity's state.
    const state = JSON.stringify(entity[entity.type].state);
    client.publish(TOPIC.state(entity), state, { retain: true });

    const cmndTopic = TOPIC.command(entity);
    routeCmndTopic(cmndTopic);
};

const initHAEntities = async () => {
    const entities = await listEntities();
    entities.forEach((_entity) => {
        configHAEntity(_entity);
    });
}

/**
 * Sync database's entity with Home Assistant's.
 */
initHAEntities();

module.exports = {
    configHAEntity,

    /**
     * Delete the device by publishing a MQTT
     * message with empty payload then unroute
     * the expired topics.
     * @param {*} entity
     */
    deleteEntity: (entity) => {
        // build the topic
        const topic = dicoveryTopic(entity);

        // TODO: should support FAN, HVAC...
        client.publish(TOPIC.state(entity), entity.state, { retain: false });
        mqtt.unroute(topic);
        client.publish(topic, '');
    }
};
