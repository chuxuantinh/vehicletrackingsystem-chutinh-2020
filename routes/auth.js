const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Agency } =require('../models/agency');
const { Driver } =require('../models/driver');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

router.post('/auth/agency', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    let agency = await Agency.findOne({ emailId: req.body.email });
    if (!agency) return res.status(400).send('Invalid email');
  
    const validPassword = await bcrypt.compare(req.body.password, agency.password);
    if (!validPassword) return res.status(400).send('Invalid password.');
  
    const token = agency.generateAuthToken();
    const decoded = jwt.verify(token, 'vehicle');
    return res.cookie("xAuthToken", token).status(200).redirect('/dashboard/agency/'+decoded._id);
  });

router.post('/auth/driver', async (req, res) => {
    let driver = await Driver.findOne({ mobileNo: req.body.mobileNo });
    if (!driver) return res.status(400).send('Invalid Mobile Number');
  
    const validPassword = await bcrypt.compare(req.body.password, driver.password);
    if (!validPassword) return res.status(400).send('Invalid password.');
  
    const token = driver.generateAuthToken();
    const decoded = jwt.verify(token, 'vehicle');
    return res.cookie("xAuthToken", token).status(200).redirect('/dashboard/driver/'+decoded._id);
});

function validate(auth){
    const schema = {
        email: Joi.string().email({ minDomainAtoms: 2 }),
        password: Joi.string().min(6).max(24).required()
    }
    return Joi.validate(auth, schema)
}

module.exports = router;