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
    }
}