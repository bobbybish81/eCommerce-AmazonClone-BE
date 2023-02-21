import Joi from 'joi';

// validator accepts a schema and returns a function which takes in the payload.
// once invoked this will retun the error/value object
const validator = (schema) => 
  (payload) => schema.validate(payload, {abortEarly: false})

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(35).required(),
  confirmPassword: Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' }),
  role: Joi.string().min(4).required(),
  uniqueStoreId: Joi.number().required(),
})
  
export const validateRegistration = validator(registerSchema)
