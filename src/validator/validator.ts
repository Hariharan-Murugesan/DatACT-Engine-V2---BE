import joi from 'joi';

const userLoginValidator = joi.object({
    username: joi.string().max(100).required(),
    password: joi.string().min(6).max(100).required()
});

export default {
    userLoginValidator
}