const { device: {getDevice} } = require('../api/model');
const { TOPIC, client } = require('./client');
const Interpreter = require('js-interpreter');
const { sendRawList } = require('./irCode');
const { entity: { updateEntity } } = require('../api/model');

const stateLock = {};

/**
 * This function returns all the state of a device
 * @param {*} deviceId ID of the deviec
 * @returns 
 */
async function getAllState(deviceId) {
    const allState = {};

    const device = await getDevice({ id: deviceId });
    const entities = device.entities;

    entities.forEach((_) => {
        let subType = _[_.type];
        switch(_.type) {
            case 'button':
                allState[`${_.id}`] = {
                    blockName: _.name,
                    state: false,
                    type: typeof(false),
                    entityId: _.id,
                    statePrefix: '',
                    entityType: _.type,
                };
            break;
            case 'switch':
                allState[`${_.id}`] = {
                    blockName: _.name,
                    state: subType.state,
                    type: typeof(subType.state),
                    entityId: _.id,
                    statePrefix: '',
                    entityType: _.type,
                };
            break;
            case 'select':
                allState[`${_.id}`] = {
                    blockName: _.name,
                    state: subType.state,
                    type: typeof(subType.state),
                    entityId: _.id,
                    statePrefix: '',
                    entityType: _.type,
                };
            break;
            case 'number':
                allState[`${_.id}`] = {
                    blockName: _.name,
                    state: subType.state,
                    type: typeof(subType.state),
                    entityId: _.id,
                    statePrefix: '',
                    entityType: _.type,
                };
            break;
            case 'fan':
                allState[`${_.id}`] = {
                    blockName: _.name,
                    state: subType.state,
                    type: typeof(subType.state),
                    entityId: _.id,
                    statePrefix: '',
                    entityType: _.type,
                }
                if(_.fan.enableDirection) {
                    allState[`${_.id}/direction`] = {
                        blockName: `${_.name} >> direction`,
                        state: _.fan.directionState,
                        type: typeof(_.fan.directionState),
                        entityId: _.id,
                        statePrefix: 'direction',
                        entityType: _.type,
                    };
                }
                if(_.fan.enableOscillation) {
                    allState[`${_.id}/oscillation`] = {
                        blockName: `${_.name} >> oscillation`,
                        state: _.fan.oscillationState,
                        type: typeof(_.fan.oscillationState),
                        entityId: _.id,
                        statePrefix: 'oscillation',
                        entityType: _.type,
                    };
                }
                if(_.fan.enablePercentage) {
                    allState[`${_.id}/percentage`] = {
                        blockName: `${_.name} >> speed`,
                        state: _.fan.percentageState,
                        type: typeof(_.fan.percentageState),
                        entityId: _.id,
                        statePrefix: 'percentage',
                        entityType: _.type,
                    };
                }
                if(_.fan.enablePresetMode) {
                    allState[`${_.id}/presetMode`] = {
                        blockName: `${_.name} >> preset mode`,
                        state: _.fan.presetModeState,
                        type: typeof(_.fan.presetModeState),
                        entityId: _.id,
                        statePrefix: 'presetMode',
                        entityType: _.type,
                    };
                }
        }
    });

    return allState;
}

async function getAllConst(deviceId) {
    const allConst = {};

    const device = await getDevice({ id: deviceId });
    const entities = device.entities;

    entities.forEach((_) => {
        let subType = _[_.type];
        switch(_.type) {
            case 'button':
                // no const for button
            break;
            case 'switch':
                // no const for switch
            break;
            case 'select':
                allConst[`${_.id}/options`] = {
                    blockName: `${_.name} >> options`,
                    const: JSON.parse(subType.options),
                    type: 'array',
                }
            break;
            case 'number':
                allConst[`${_.id}/min`] = {
                    blockName: `${_.name} >> min`,
                    const: subType.min,
                    type: typeof(subType.min),
                }
                allConst[`${_.id}/max`] = {
                    blockName: `${_.name} >> max`,
                    const: subType.max,
                    type: typeof(subType.max),
                }
                allConst[`${_.id}/step`] = {
                    blockName: `${_.name} >> step`,
                    const: subType.step,
                    type: typeof(subType.step),
                }
            break;
            case 'fan':
                if (subType.enableDirection) {
                    allConst[`${_.id}/direction/forward`] = {
                        blockName: `${_.name} >> direction <forward>`,
                        const: 'forward',
                        type: 'string',
                    }
                    allConst[`${_.id}/direction/reverse`] = {
                        blockName: `${_.name} >> direction <reverse>`,
                        const: 'reverse',
                        type: 'string',
                    }
                }
                if (subType.enablePercentage) {
                    allConst[`${_.id}/speedRangeMin`] = {
                        blockName: `${_.name} >> speedRangeMin`,
                        const: 1,
                        type: 'number',
                    }
                    allConst[`${_.id}/speedRangeMax`] = {
                        blockName: `${_.name} >> speedRangeMax`,
                        const: subType.speedRangeMax,
                        type: typeof(subType.speedRangeMax),
                    }
                }
                if (subType.enablePresetMode) {
                    allConst[`${_.id}/presetModes`] = {
                        blockName: `${_.name} >> presetModes`,
                        const: JSON.parse(subType.presetModes),
                        type: 'array',
                    }
                }
            break;
        }
    });

    return { consts: allConst, boardId: device.boardId };
}

async function getAllIrCode(deviceId) {
    const allIrCode = {};

    const device = await getDevice({ id: deviceId });
    const irCodes = device.irCodes;
    irCodes.forEach((_) => {
        allIrCode[_.id] = {
            blockName: _.name,
            blockDescription: _.description,
            rawData: _.rawData,
            code: _.code,
            irSendInterval: device.irSendInterval, // get the device's ir send interval
        };
    });

    return allIrCode;
}

/**
 * This function get all the require data for the callback to run
 * @param {*} deviceId 
 * @param {*} stateKey 
 * @param {*} message 
 * @returns an object { originalStates, consts, irCodes, targetStates, boardId }
 */
async function haCallbackGetData(deviceId, stateKey, message) {
    const [ originalStates, { consts, boardId }, irCodes ] = await Promise.all([
        getAllState(deviceId),
        getAllConst(deviceId),
        getAllIrCode(deviceId),
    ]);
    const targetStates = structuredClone(originalStates);

    // parse the target state value
    let targetStateValue;
    if(originalStates[stateKey].type == 'string') {
        targetStateValue = message;
    } else {
        // if its not string, parse it
        targetStateValue = JSON.parse(message);
    }
    
    // finally set the target state to the sent value
    targetStates[stateKey].state = targetStateValue;

    return { originalStates, consts, irCodes, targetStates, boardId };
}

/**
 * This function create the functions that bridge the interpreter and the callback
 * @param {*} { originalStates, consts, irCodes, targetStates, irCodeToSend }
 * @returns an object { getOriginalState, getTargetState, getConst, queueIrCode }
 */
function haCreateInterpreterFunctions({  
    originalStates,
    consts,
    irCodes,
    targetStates,
    irCodeToSend,
}) {
    const getOriginalState = (stateKey) => originalStates[stateKey].state;

    const getTargetState = (stateKey) => targetStates[stateKey].state;
    const getConst = (constKey) => consts[constKey].const;
    const queueIrCode = (irCodeKey) => {
        if(irCodeKey != '') {
            irCodeToSend.push(Object.assign({}, irCodes[irCodeKey])); // Object.assign to avoid pass by refrence
        }
    }

    return { getOriginalState, getTargetState, getConst, queueIrCode };
}

/**
 * This function create the init function for the interpreter
 * @param {*} { getOriginalState, getTargetState, getConst, applyStateChange, queueIrCode }
 * @returns the init function for the interpreter
 */
function haCreateInterpreterInit({
    getOriginalState,
    getTargetState,
    getConst,
    applyStateChange,
    queueIrCode,
}) {
    return (interpreter, globalObject) => {

        interpreter.setProperty(globalObject, 'getOriginalState',
            interpreter.createNativeFunction(getOriginalState));
        interpreter.setProperty(globalObject, 'getTargetState',
            interpreter.createNativeFunction(getTargetState));
        interpreter.setProperty(globalObject, 'getConst',
            interpreter.createNativeFunction(getConst));
        interpreter.setProperty(globalObject, 'applyStateChange',
            interpreter.createNativeFunction(applyStateChange));
        interpreter.setProperty(globalObject, 'queueIrCode',
            interpreter.createNativeFunction(queueIrCode));
    };
}

/**
 * Publish the original state to the Homeassistant
 */
async function haNoStateChange(device, stateKey, originalState) {
    const message = (originalState.type == 'string')? originalState.state : originalState.state.toString();
    client.publish(TOPIC.stateFromState(device.id, stateKey), message, { retain: true });
    console.log('no change', device.id, stateKey, originalState);
}

/**
 * Publish the target state to the Homeassistant
 */
async function haApplyStateChange(device, stateKey, targetState) {
    const stateName = `${ targetState.statePrefix == ''? 's' : targetState.statePrefix + 'S' }tate`;
    const entity = {
        id: targetState.entityId,
        type: targetState.entityType,
    };
    entity[entity.type] = {};
    entity[entity.type][stateName] = targetState.state;
    try {
        if(targetState.entityType != 'button') {
            await updateEntity(entity);
        }
    } catch(err) {
        console.error(err);
    }
    
    const message = (targetState.type == 'string')? targetState.state : targetState.state.toString();
    client.publish(TOPIC.stateFromState(device.id, stateKey), message, { retain: true });
    console.log('yes change', device.id, stateKey, targetState);
}

function stateIsLocked(stateKey) {
    if(stateLock[stateKey] == undefined) {
        return false;
    } else {
        return stateLock[stateKey];
    }
}

function lockState(stateKey) {
    stateLock[stateKey] = true;
}

function unlockState(stateKey) {
    stateLock[stateKey] = false;
}

function createHaCallBack(deviceId, stateKey) {
    return async (topic, message) => {
        // TODO implement state lock
        if(stateIsLocked(stateKey)) {
            return;
        }
        lockState(stateKey);
        
        const device = await getDevice({id: deviceId});

        message = message.toString();
        let shouldApplyStateChange = false;

        // * get the current data needed by the blockly code from the db
        const { originalStates, consts, irCodes, targetStates, boardId }
            = await haCallbackGetData(deviceId, stateKey, message);

        // * don't send any irCodes if it's not enableUpdate
        if(!device.enableUpdate) {
            // only update the state, no further instructions needed
            haApplyStateChange(device, stateKey, targetStates[stateKey]);
            unlockState(stateKey);
            return;
        }

        // * create functions that bridge the js interpreter and the above datas and ir codes

        let irCodeToSend = [];

        const { getOriginalState, getTargetState, getConst, queueIrCode }
            = haCreateInterpreterFunctions({ originalStates, consts, irCodes, targetStates, irCodeToSend });
        
        const applyStateChange = () => {
            shouldApplyStateChange = true;
        };

        const interpreterInit
            = haCreateInterpreterInit({ getOriginalState, getTargetState, getConst, applyStateChange, queueIrCode });
        
        // * run blockly code using js interpreter
        const blocklyJS = device.blocklyJS;

        const blocklyInterpreter = new Interpreter(blocklyJS, interpreterInit);

        blocklyInterpreter.run();
        
        // * send the ir codes to the queue
        try {
            await sendRawList(boardId, irCodeToSend);
        } catch(err) {
            // timeout, something went wrong on the board side
            // so no change is applied
            haNoStateChange(device, stateKey, originalStates[stateKey]);
            unlockState(stateKey);
            return;
        }
        
        if(shouldApplyStateChange) {
            haApplyStateChange(device, stateKey, targetStates[stateKey]);
        }

        haNoStateChange(device, stateKey, originalStates[stateKey]);

        unlockState(stateKey);
    }
}

async function getAllStateByEntityId(deviceId, entityId) {
    const states = await getAllState(deviceId);
    return Object.keys(states).reduce((entityStates, key) => {
        // console.log('WOW', states[key].entityId, entityId);
        if(states[key].entityId == entityId) {
            entityStates[key] = states[key];
        }
        return entityStates;
    }, {});
}

module.exports = {
    getAllState,
    getAllConst,
    getAllIrCode,
    createHaCallBack,
    getAllStateByEntityId,
}