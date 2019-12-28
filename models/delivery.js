const { locationSchema } = require('./location');
const mongoose = require('mongoose');
const Joi = require('joi');

const Delivery = mongoose.model('Delivery', new mongoose.Schema({
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agency" 
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver" 
    },
    vType: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['small', 'medium', 'heavy']
    },
    vNumber: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 12,
        lowercase: true
    },
    vCapacity: {
        type: Number,
        required: true,
    },
    vBrand: {
        type: String,
        required: true,
        maxlength: 32,
        lowercase: true
    },
    totalMaterial: {
        type: Number,
        required: true,
    },
    fLocation: {
        type: String,
        required: true,
        maxlength: 32,
        lowercase: true
    },
    tLocation: {
        type: String,
        required: true,
        maxlength: 32,
        lowercase: true
    },
    locations: [locationSchema],
    isCompleted: {
        type: Boolean,
        default: false,
    }
}));

function validator(delivery){
    const schema = {
        agencyId: Joi.string().max(64).required(),
        driverId: Joi.string().max(64).required(),
        vType: Joi.string().required(),
        vNumber: Joi.string().min(2).max(12).required(),
        vCapacity: Joi.number().required(),
        vBrand: Joi.string().max(32).required(),
        totalMaterial: Joi.number().required(),
        fLocation: Joi.string().max(32).required(),
        tLocation: Joi.string().max(32).required()  
    }
    return Joi.validate(delivery, schema)
}

module.exports.Delivery = Delivery;
module.exports.validator = validator;