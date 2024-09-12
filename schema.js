const Joi = require('joi');

const listingSchema = Joi.object({
    lisitng : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(),
        Image: Joi.string().allow("", null)
    }).required()
});