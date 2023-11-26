module.exports = {
    showReqInfo: ({method, originalUrl, path}) => async (req, res, next) => {
        let logMessage = '';

        if (method) logMessage += req.method + ' ';
        if (originalUrl) logMessage +=req.originalUrl + ' ';
        if (path) logMessage +=req.path + ' ';

        console.log(logMessage);

        next();
    }
};