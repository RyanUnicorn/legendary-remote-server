module.exports = {
    /**
     * A middleware that parses the `select`.`options`
     * into array due to primitive type can't be array
     * inside the database.
     */
    selectOptionParser: (req, res, next) => {
        let entity = req.body;

        /**
         * go next and return if entity type is not
         * `select` or the options is empty.
         */
        if (entity.type != 'select' || !entity.select?.options) {
            next();
            return;
        }

        entity.select.options = JSON.stringify(entity.select.options);
        next();
    },

    /**
     * A middleware that parses the `fan`.`presetModes` array
     * into stringified string due to primitive type can't be array
     * inside the database, so the value is stored using string instead.
     */
    fanPresetModesParser: (req, res, next) => {
        let entity = req.body;

        /**
         * go next and return if entity type is not
         * `fan` or the options is empty.
         */
        if (entity.type != 'fan' || !entity.fan?.presetModes) {
            next();
            return;
        }

        entity.fan.presetModes = JSON.stringify(entity.fan.presetModes);
        next();
    },
}