const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const driverSchema = new mongoose.Schema({
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agency" 
    },

    firstName: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        maxlength: 24
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        maxlength: 24
    },
    mobileNo: {
        type: Number,
        required: true,
        minlength: 10,
        maxlength: 10,
        unique: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    pincode: {
        type: Number,
        required: true,
        minlength: 6,
        maxlength: 6,
        lowercase: true
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 6,
        maxlength: 128
    },
    password: {
        type: String,
        require: true,
        maxlength: 256
    }
});

driverSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: false}, 'vehicle');
    return token;
}

const Driver = mongoose.model('Driver', driverSchema);

function validator(driver){
    const schema = {
        agencyId: Joi.string().max(64).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        mobileNo: Joi.string().max(10).required(),
        password: Joi.string().max(256).required(),
        gender: Joi.string().required(),
        pincode: Joi.string().min(6).max(6).required(),
        city: Joi.string().required(),
        address: Joi.string().max(128).required()
    }
    return Joi.validate(driver, schema)
}

module.exports.Driver = Driver;
module.exports.validator = validator;