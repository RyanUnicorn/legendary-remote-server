const { TOPIC, client, ...mqtt } = require('./client');
const { sendRaw } = require('./irCode');
const { irCode: model, entity: {listEntities}, device: {listDevices} } = require('../api/model');
const { device } = require('../api/validation');
const { getAllState, getAllStateByEntityId, createHaCallBack } = require('./blocklyManager');

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
        optimistic: false,
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
                payload_on: 'true',
                payload_off: 'false',
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
                payload_press: 'true',
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

        case 'fan':
            additionalKeys = {
                payload_off: 'false',
                payload_on: 'true',
            };

            if (_.fan.enableDirection) {
                Object.assign(additionalKeys, {
                    direction_command_topic: `${TOPIC.command(_)}/direction`,
                    direction_state_topic: `${TOPIC.state(_)}/direction`,
                });
            }

            if (_.fan.enableOscillation) {
                Object.assign(additionalKeys, {
                    oscillation_command_topic: `${TOPIC.command(_)}/oscillation`,
                    oscillation_state_topic: `${TOPIC.state(_)}/oscillation`,
                    payload_oscillation_off: `false`,
                    payload_oscillation_on: `true`,
                });
            }

            if (_.fan.enablePercentage) {
                Object.assign(additionalKeys, {
                    percentage_command_topic: `${TOPIC.command(_)}/percentage`,
                    percentage_state_topic: `${TOPIC.state(_)}/percentage`,

                    speed_range_min: 1,
                    speed_range_max: _.fan.speedRangeMax,
                });
            }

            if (_.fan.enablePresetMode) {
                Object.assign(additionalKeys, {
                    preset_mode_command_topic: `${TOPIC.command(_)}/presetMode`,
                    preset_mode_state_topic: `${TOPIC.state(_)}/presetMode`,
                    preset_modes: JSON.parse(_.fan.presetModes),
                });
            }

            break;

        default:
            break;
    }

    // add the additional keys into
    // the output entity.
    Object.assign(_entity, additionalKeys);

    return _entity;
}

async function subCmndTopic(device) {
    const states = await getAllState(device.id);
    Object.keys(states).forEach((stateKey) => {
        mqtt.unroute(TOPIC.commandFromState(device.id, stateKey));
        mqtt.route(
            TOPIC.commandFromState(device.id, stateKey),
            createHaCallBack(device.id, stateKey),
        );
    });
}

async function initSubCmndTopic() {
    const devices = await listDevices();
    devices.forEach((device) => {
        subCmndTopic(device);
    });
}

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
const configHAEntity = async (entity) => {
    publishEntity(entity);
    
    // * Publish entity's state.
    const entityStates = await getAllStateByEntityId(entity.device.id, entity.id);
    // for every state of that entity, we publish
    Object.keys(entityStates).forEach((key) => {
        const state = JSON.stringify(entityStates[key].state);
        client.publish(TOPIC.stateFromState(entity.device.id, key), state, { retain: true });
    });
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

function init() {
    initHAEntities();
    initSubCmndTopic();
}

module.exports = {
    init,
    configHAEntity,
    subCmndTopic,

    /**
     * Delete the device by publishing a MQTT
     * message with empty payload then unroute
     * the expired topics.
     * @param {*} entity
     */
    deleteEntity: async(entity) => {

        // * Publish and unroute entity's states
        const entityStates = await getAllStateByEntityId(entity.device.id, entity.id);
        
        // for every state of that entity, we publish and unroute it
        Object.keys(entityStates).forEach((key) => {
            const state = JSON.stringify(entityStates[key].state);
            client.publish(TOPIC.stateFromState(entity.device.id, key), state, { retain: false });
            mqtt.unroute(TOPIC.commandFromState(entity.device.id, key));
        });

        // remove it from HA using empty config payload
        client.publish(TOPIC.discovery(entity), '');
    }
};
