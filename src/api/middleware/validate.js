
const MODE = {
    ALL: 0b11,
    PARAM: 0b10,
    BODY: 0b01,
}

module.exports = {
    /**
     * Do the validation depends on the mode code.
     */
    validate: (schema, mode) => async (req, res, next) => {
        try {
            if (mode & MODE.PARAM) {
                req.params = await schema.params.validate(req.params);
            }
    
            if (mode & MODE.BODY) {
                req.body = await schema.body.validate(req.body);
            }
            
            next();
        } catch (err) {
            // respond the error message
            res.status(400).send(err.message);
        }
    },
}