const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
var { isEmail } = require('validator');

const agencySchema =  new mongoose.Schema({
userName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 64,
    lowercase: true
},
agencyName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 64,
    lowercase: true
},
emailId: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: [ isEmail, 'Invalid email' ]
},
mobileNo: {
    type: Number,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
},
password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128
},
agencyCity: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 64,
    lowercase: true
},
agencyPincode: {
    type: String,
    minlength: 6,
    maxlength: 6
},
agencyAddress: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
    lowercase: true
},
agencyWebsite: {
    type: String,
    lowercase: true
},
agencyDescription: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 256,
    lowercase: true
},
isAdmin: {
    type: Boolean,
    default: true
}
});

agencySchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin }, 'vehicle');
    return token;
}

const Agency = mongoose.model('Agency', agencySchema);



function validator(agency){
    const schema = {
        userName: Joi.string().min(2).max(64).required(),
        agencyName: Joi.string().min(2).max(64).required(),
        emailId: Joi.string().email({ minDomainAtoms: 2 }),
        mobileNo: Joi.string().min(10).max(10).required(),
        password: Joi.string().required(),
        agencyCity: Joi.string().min(2).max(64).required(),
        agencyPincode: Joi.string().min(6).max(6).required(),
        agencyAddress: Joi.string().min(2).max(256).required(),
        agencyWebsite: Joi.string(),
        agencyDescription: Joi.string().min(6).max(500).required()  
    }
    return Joi.validate(agency, schema)
}

module.exports.Agency = Agency;
module.exports.validator = validator;