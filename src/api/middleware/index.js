

module.exports = {
    validate: require('./validate'), 
    dev: require('./dev'),
    entity: require('./entity'),

    MODE: {
        ALL: 0b11,
        PARAM: 0b10,
        BODY: 0b01,
    },
}