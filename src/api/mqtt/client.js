const mqtt = require('mqtt');
const BROKER_URL = 'mqtt://' + process.env.MQTT_BROKER;

const client = mqtt.connect(BROKER_URL);

// time interval of every board discover message
client.BOARD_INTERVAL = 1000;
// 500ms is a redundant delay
client.BOARD_TIMEOUT = client.BOARD_INTERVAL + 500;

// {`topic`: `callback`, ...}
let topicsSub = {};

/**
 * 
 * @param {*} topicToSub topic to subscribe
 * @param {*} callback callback
 * function (topic, message)
 */
route = async (topicToSub, callback) => {
    topicsSub[topicToSub] = callback;

    // subscribe the topic
    await client.subscribeAsync(topicToSub)
        .catch(console.error);

    // Debug message
    if (process.env._DEBUG_MQTT_SUB) {
        console.log(`_DEBUG_MQTT_SUB: ${topicToSub}`);
    }
};

unroute = async (topicToUnsub) => {
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
            // TODO: implement `#` wildcare.
            // ? May implement with regexp?
            if (topic.startsWith(_topic)) {
                topicsSub[_topic](topic, message);
            }
        });
    });
});

module.exports = {
    client,
    route,
    unroute,
};