const mongoose = require('mongoose');
const _ = require('lodash');
const admin = require('../middleware/admin');
const token = require('../middleware/token');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const { Driver, validator } = require('../models/driver');
const { Agency } = require('../models/agency');

router.get('/register/:id', token,async (req, res) => {
    try{
        const agencyId = req.params.id;  
        let agencyName = await Agency.findById(agencyId).select('agencyName -_id');
        return res.render('./dashboard/agency/registerDriver', {
            agencyId,
            agencyName
        });
    }catch(ex){
        return res.send(ex.message);
    }
});

router.post('/register', token, async (req, res) => {
        const {error} = validator(req.body);
        if(error){ return res.status(400).send(error.details[0].message);}
 
       try{
        let driver = await new Driver(_.pick(req.body, ['agencyId', 'firstName', 'lastName', 'mobileNo','password', 'gender', 'pincode', 'city', 'address']));
        const mobileNo = await Driver.find({mobileNo: req.body.mobileNo}).select('mobileNo');
        
        if(_.isEmpty(mobileNo, true)){
            const salt = await bcrypt.genSalt(10);
            driver.password = await bcrypt.hash(req.body.password, salt);
            const result = await driver.save();
            return res.redirect('/driver/list/'+result.agencyId);  
        }

        return res.send('Mobile Number already exist');
        
       }
       catch(ex){ return res.status(400).send(ex.message); }   
   
});

router.get('/profile/:id', async (req, res) => {
    try{
        const driver = await Driver.findOne({_id: req.params.id});
        if(!driver){
            return res.status(400).send('Your data not Found');
        }

        let agencyId = driver.agencyId;
        let agencyName = await Agency.findOne({_id: agencyId}).select('agencyName -_id');
        return res.status(200).render('./profile/profileDriver', {
            driver,
            agencyName
        })
    }
    catch(ex){
        return console.log(ex.message);
    }
});

router.get('/list/:id', token, async (req, res) => {
    try{
        const agencyId = req.params.id;
        const drivers = await Driver.find({agencyId: req.params.id});
        const agencyName = await Agency.findById(agencyId).select('agencyName -_id');
        if(!drivers){
            return res.send('You Does not have any Driver');
        }
       
        return res.status(200).render('./dashboard/agency/listDriver', {
            drivers,
            agencyId,
            agencyName
        })
    }catch(ex){
        return res.send(ex.message);
    }
});

module.exports = router;