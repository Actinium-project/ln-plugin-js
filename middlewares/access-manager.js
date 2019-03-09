import * as _ from 'lodash';
/**
 * A simple access-manager middleware
 * @param {*} config 
 */
const accessManager = (config) => {
    return (req, res, next) => {
        try {
            // do some access checks here
        } catch(err) {
            if (!res.headersSent) {
                res.boom.unauthorized('Access to this API is not allowed!');
            }
        }
        next();
    };
};

export { accessManager };