const InvariantError = require('../../exceptions/InvariantError');
const  UserPayloadSchema  = require('./scheme');

const userValidator = {
    validateUserPayload:(payload)=> {
        const validationResult = UserPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
}

module.exports = userValidator;