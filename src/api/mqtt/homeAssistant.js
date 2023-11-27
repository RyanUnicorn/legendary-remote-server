const { client, ...mqtt } = require('./client');
const { sendRaw } = require('./irCode');
const { irCode: model, device: {listDevices} } = require('../model');
const { device } = require('../validation');


const DISCOVERY_PREFIX = 'homeassistant';
const DEVICE_PREFIX = 'dev'

/**
 * Home Assistant's MQTT discovery topic builder.
 * See link down below `DISCOVERY MESSAGES`/`Discovery topic` section.
 * @link https://www.home-assistant.io/integrations/mqtt/#mqtt-discovery
 * @param {*} type `<component>`
 * @param {*} nodeId `<node_id>` - optional
 * @param {*} deviceId `<object_id>`
 * @returns discovery topic.
 */
function dicoveryTopic({type, nodeId, deviceId}) {
    if (nodeId) {
        nodeId = nodeId.toString().concat('/');
    } else {
        nodeId = '';
    }
    const topic = `${DISCOVERY_PREFIX}/${type}/${nodeId}${deviceId}/config`;

    return topic;
};

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
function entity2DiscoveryPayload(entity) {
    // an alias that shorten the code
    const _ = entity;

    // output entity
    let _entity = {
        name: _.name,
        icon: _.icon ? _.icon : undefined,
        unique_id: _.id,
        command_topic: `${DEVICE_PREFIX}/${_.device.boardId}/${_.id}/cmnd`,
        state_topic: `${DEVICE_PREFIX}/${_.device.boardId}/${_.id}/state`,
        availability:
            {
                topic: `${DEVICE_PREFIX}/${_.device.boardId}/${_.id}/isAvailable`,
                payload_available: 'true',
                payload_not_available: 'false',
            },
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
                payload_on: JSON.stringify({
                    state: 'on',
                }),
                payload_off: JSON.stringify({
                    state: 'off',
                }),
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

/*
const routeCmndTopic = async (topic) => mqtt.route(topic, async (topic, message) => {
    const parsedTopic = topic.match(/dev\/([0-F]{12})\/(\d+)\/cmnd\/?(\w+)?/);
    let irCode = {
        entityId: parseInt(parsedTopic[2]),
        topicSufix: parsedTopic[3] ? parsedTopic[3] : '',
    }
    const boardId = parsedTopic[1];
    irCode = await model.getIrcode(irCode);
    if (!irCode) {
        throw new Error('123');
    }
    irCode.rawData = JSON.parse(irCode.rawData);
    await sendRaw({boardId, irCode});
});


const initIrcmndRoute = async () => {
    const devices = await listDevices();
    devices.forEach((_device) => {
        _device.irCodes.forEach((_irCode) => {
            const topic = `dev/${_device.boardId}/${_irCode.entityId}/cmnd`
                + (_irCode.topicSufix ? `/${_irCode.topicSufix}` : ``);
            routeCmndTopic(topic);
        });
    });
}*/

// initIrcmndRoute();

module.exports = {
    /**
     * Publish the entity to let Home Assistant
     * add it into the integration.
     * @param {*} entity 
     */
    publishEntity: (entity) => {
        // build the topic
        const topic = dicoveryTopic({type: entity.type, deviceId: entity.deviceId});
        // build the payload
        const payload = entity2DiscoveryPayload(entity);

        client.publish(topic, JSON.stringify(payload));

        console.log(payload);
        // default state available=true
        setTimeout(() => {
            client.publish(payload.availability.topic, 'true');
        }, 500);
    },

    /**
     * Delete the device by publishing a MQTT
     * message with empty payload.
     * @param {*} entity 
     */
    deleteEntity: (entity) => {
        // build the topic
        const topic = dicoveryTopic({type: entity.type, deviceId: entity.deviceId});

        client.publish(topic, '');
    }
};
