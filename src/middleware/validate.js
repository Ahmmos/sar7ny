
// global Joi validate function to use for validation of all things comes from user

import { AppError } from "../utilts/appError.js";






export const validate = (schema) => {
    return async (req, res, next) => {
        const data = { ...req.body, ...req.params, ...req.query };
        // Validate the data against the schema
        const { error } = await schema.validate(data, { abortEarly: false });

        if (error) {
            const errMsg = error.details.map(err => err.message);
            next(new AppError(errMsg, 400));
        }


        next();
    };
};