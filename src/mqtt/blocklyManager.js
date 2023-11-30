const { device: {getDevice} } = require('../api/model');
const { TOPIC } = require('./client');
const Interpreter = require('js-interpreter');
const { sendRawList } = require('./irCode');

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
        let subType;
        // assign button's default state as false
        switch(_.type) {
            case 'button':
                subType = _[_.type];
                subType.state = false;
                break;
            default:
                subType = _[_.type];
                break;
        }
        const stateRuleRegex = /(^\w*)[sS]tate$/;
        
        /**
         *  filter out the subtype's content by its keys, the filtered object
         *  will contains only the keys that maches the above regex (ends with state)
         * 
         *  TLDR: It filter the subtype with only the state left
         */
        const entityStates = Object.keys(subType)
        .filter((key) => stateRuleRegex.test(key))
        .reduce((obj, key) => {
            // append(assign) the object with the filtered key and its value
            obj[key] = subType[key];
            
            // return the accumulator object
            return obj;
        }, {});

        Object.keys(entityStates).forEach((key) => {
            // get the states name (if any) using the capturing group of the above regex
            const stateName = key.match(stateRuleRegex)[1];
            const statePath = (stateName == '') ? '' : `/${stateName}`;

            // the id would be like `<entityId>[/<stateName>]`
            allState[`${_.id}${statePath}`] = {
                blockName: _.name + ((stateName == '')? '' : ' >> ') + stateName,
                state: entityStates[key],
                type: typeof(entityStates[key]),
                entityId: _.id,
                statePrefix: stateName,
            }
        });
    });

    return allState;
}

// async function getAllStateAlt(deviceId) {
//     const allState = {};

//     const device = await getDevice({ id: deviceId });
//     const entities = device.entities;

//     entities.forEach((_) => {
//         let subType = _[_.type];
//         switch(_.type) {
//             case 'button':
//                 allState[`${_.id}`] = {
//                     blockName: _.name,
//                     state: false,
//                     type: typeof(false),
//                 }
//             break;
//             case 'switch':
//                 allState[`${_.id}`] = {
//                     blockName: _.name,
//                     state: subType.state,
//                     type: typeof(subType.state),
//                 }
//             break;
//             case 'select':
//                 allState[`${_.id}`] = {
//                     blockName: _.name,
//                     state: subType.state,
//                     type: typeof(subType.state),
//                 }
//             break;
//             case 'number':
//                 allState[`${_.id}`] = {
//                     blockName: _.name,
//                     state: subType.state,
//                     type: typeof(subType.state),
//                 }
//             break;
//         }
//     });

//     return allState;
// }

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
            rawData: JSON.parse(_.rawData),
            code: _.code,
        };
    });

    return allIrCode;
}

function createHaCallBack(deviceId, stateKey) {
    return async (topic, message) => {
        const device = await getDevice({id: deviceId});

        message = message.toString();
        let shouldApplyStateChange = false;

        // get the current data needed by the blockly code from the db
        const { originalStates, consts, irCodes, targetStates, boardId }
            = await haCallbackGetData(deviceId, stateKey, message);

        // create functions that bridge the js interpretor and the above datas and ir codes

        let irCodeToSend = [];

        const getOriginalState = (stateKey) => originalStates[stateKey];

        const getTargetState = (stateKey) => targetStates[stateKey];
        const getConst = (constKey) => consts[constKey];
        const applyStateChange = () => {
            shouldApplyStateChange = true;
        }
        const queueIrCode = (irCodeKey) => {
            irCodeToSend.push(irCodes[irCodeKey]);
        }

        const init = (interpreter, globalObject) => {

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
        
        // TODO: implement enableUpdate things
        // run blockly code using js interpretor
        const blocklyJS = `queueIrCode(3);`;

        const blocklyInterpreter = new Interpreter(blocklyJS, init);

        blocklyInterpreter.run();

        // send the ir codes to the queue
        await sendRawList(boardId, irCodeToSend);
        
        // update the state if blockly wants it

    }
}

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

module.exports = {
    getAllState,
    getAllConst,
    getAllIrCode,
    createHaCallBack,
}