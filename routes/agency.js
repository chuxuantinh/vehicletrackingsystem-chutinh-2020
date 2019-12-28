const jwt  =require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Agency, validator } = require('../models/agency');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const token = require('../middleware/token')

router.post('/register', async (req, res) => {
    const {error} = validator(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

   if(!error){
       try{
        let agency = await new Agency(_.pick(req.body, ['userName', 'agencyName', 'emailId', 'mobileNo', 'password', 'agencyCity', 'agencyPincode', 'agencyAddress', 'agencyDescription']));
        const salt = await bcrypt.genSalt(10);
        agency.password = await bcrypt.hash(req.body.password, salt);
        const result = await agency.save();
        if(!result){
            return res.status(400).send('Error has occured please try after some time');
        }
        const token = agency.generateAuthToken();
        const decoded = jwt.verify(token, 'vehicle');
        return res.cookie("xAuthToken", token).status(200).redirect('/dashboard/agency/'+decoded._id);
       }
       catch(ex){
           return res.status(400).send(ex.message);
       }   
    }
}
);

router.get('/profile/:id', token, async (req, res) => {
    try{
        const agencyId = req.params.id;
        const agency = await Agency.findById({_id: agencyId}).select('-password -isAdmin');
        const agencyName = await Agency.findById(agencyId).select('agencyName -_id');
        if(!agency){
            return res.status(400).send('Your data not Found');
        }

        return res.status(200).render('./profile/profileAgency', {
            agency,
            agencyName,
            agencyId
        });
    }
    catch(ex){
        return console.log(ex.message);
    }
});

module.exports = router;