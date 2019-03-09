import { stringify } from "querystring";
/**
 * General error-manager middleware
 * @param {*} config 
 */
const errorHandler = (config) => {
    return (err, req, res, next) => {
        console.log(JSON.stringify(err, null, 3));
        next(err);
    };
};

export { errorHandler };