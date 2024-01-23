const Joi = require("@hapi/joi");

const validate = (req) => {
    const schema = Joi.object( {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).max(1024).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return error.details[0].message;
    }
}

module.exports = validate;
