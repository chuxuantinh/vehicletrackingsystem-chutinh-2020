const mongoose = require('mongoose');
const Joi = require('joi');

const locationSchema = new mongoose.Schema({
    lat: {
        type: String,
    },
    lng: {
        type: String,
    }
});

const Location = mongoose.model('Location', locationSchema);

module.exports.locationSchema = locationSchema;
module.exports.Location = Location;
