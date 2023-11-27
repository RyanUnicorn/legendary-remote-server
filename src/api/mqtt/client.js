const mqtt = require('mqtt');
const BROKER_URL = 'mqtt://' + process.env.MQTT_BROKER;

const client = mqtt.connect(BROKER_URL);

// time interval of every board discover message
client.BOARD_INTERVAL = 1000;
// 500ms is a redundant delay
client.BOARD_TIMEOUT = client.BOARD_INTERVAL + 500;

// {`topic`: {`regexp`, `callback`}, ...}
let topicsSub = {};

/**
 * Add a topic to subscribe
 * @param {*} topicToSub topic to subscribe
 * @param {*} callback callback
 * @param {*} regexp regular expression to compare
 * to the topic, leave this blank to set regexp to
 * the exact same as topicToSub.
 * function (topic, message)
 */
const route = async (topicToSub, callback, regexp) => {
    topicsSub[topicToSub] = { 
        callback: callback,
        regexp: regexp ? regexp : new RegExp(topicToSub), 
    };

    // subscribe the topic
    await client.subscribeAsync(topicToSub)
        .catch(console.error);

    // Debug message
    if (process.env._DEBUG_MQTT_SUB) {
        console.log(`_DEBUG_MQTT_SUB: ${topicToSub}`);
    }
};

/**
 * Unsynscribe a MQTT topic.
 */
const unroute = async (topicToUnsub) => {
    delete topicsSub[topicToUnsub];

    // subscribe the topic
    await client.unsubscribeAsync(topicToUnsub)
        .catch(console.error);

    // Debug message
    if (process.env._DEBUG_MQTT_UNSUB) {
        console.log(`_DEBUG_MQTT_UNSUB: ${topicToUnsub}`);
    }
};

/**
 * MQTT message handler.
 */
client.on('connect', () => {
    client.on('message', (topic, message) => {
        /**
         * Search for the topic we subbed and
         * call it's callback.
         */
        Object.keys(topicsSub).forEach(_topic => {
            // if matches the expression, call it's callback.
            if (topic.match(topicsSub[_topic].regexp)) {
                topicsSub[_topic].callback(topic, message);
            }
        });
    });
});

module.exports = {
    client,
    route,
    unroute,
};