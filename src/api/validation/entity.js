const { object, string, number, boolean, array} = require('yup');

// entity types' schema
const subtype = {
    switch: object({
        entityId: number().positive().integer(),
        state: boolean().required(),
    }),

    select: object({
        entityId: number().positive().integer(),
        options: array().of(string()).min(1).required(),
        state: string().notRequired(),
    }),

    button: object({
        entityId: number().positive().integer(),
    }),

    number: object({
        entityId: number().positive().integer(),
        state: number().default(1),
        max: number().optional(),
        min: number().optional(),
        step: number().min(0.001).optional(),
        isSlider: boolean(),
    }),
}

// An Array that contains every entity types.
const subtypeKeys = Object.keys(subtype);

/**
 * 
 * @param {*} _subtype 
 * @returns a callback function that returns 
 * Schema that required on the subtype is the
 * actual entity type, Schema that not required
 * and not going to output on the subtype is
 * not the actual entity type
 */
const entitySubtype = (_subtype) =>  ([type], schema) => {
        if (type == _subtype) return schema.required().noUnknown();
        return schema.test(
            'is-null',
            `${_subtype} should be empty`,
            (value) => !value || Object.keys(value).length == 0,
          ).notRequired().strip();
    };

module.exports = {
    schema: {
        // entityId
        params: object({
            id: number().positive().integer(),
        }),
        // entity data
        body: object({
            deviceId: number().positive().integer(),
            id: number().positive().integer(),
            name: string(),
            icon: string().notRequired(),
            // check if the type is supported.
            type: string().test(
                'valid type',
                `type is not supported`,
                (_type) => !_type || subtypeKeys.includes(_type),
            ),
            switch: subtype.switch.when('type', entitySubtype('switch')),
            select: subtype.select.when('type', entitySubtype('select')),
            button: subtype.button.when('type', entitySubtype('button')),
            number: subtype.number.when('type', entitySubtype('number')),
            
        }),
    },
}