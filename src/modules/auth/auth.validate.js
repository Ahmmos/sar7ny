
import Joi from "joi";


const registerVal = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^_])[A-Za-z\d@.#$!%*?&^_]{8,15}$/
    ).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),

})


export {
    registerVal,

}
