const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Delivery } = require('../models/delivery');
const { Agency } = require('../models/agency');
const { Driver } = require('../models/driver');
const { Location } = require('../models/location');
const NodeGeocoder = require('node-geocoder');
const _ = require('lodash');

let options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: 'AIzaSyCwpIltCnAhMK3vY7J6g9b7uEYX-Su3wo0',
    formatter: null
};

let geocoder = NodeGeocoder(options);

router.post('/store', async (req, res) => {
    try {
        const deliveryId = req.body.deliveryId;
        const lat = req.body.lat;
        const lon = req.body.lon;
        console.log('deliveryid from client', deliveryId);
        await addLocation(deliveryId, new Location({ lat: req.body.lat, lng: req.body.lon }));  //calling to addLocation Method to store requesting location
    }
    catch (ex) {
        console.log(`Message ${ex.message}`);
    }
});

router.get('/tracker/:id', async (req, res) => {
    const deliveryId = req.params.id;
    const delivery = await Delivery.findById(deliveryId).select('driverId _id');
    return res.render('./dashboard/driver/trackerDriver', {
        delivery
    })
});

/*router.get('/track/:id', async (req, res) => {
    const result = await Delivery.findOne({_id: req.params.id}).select('locations -_id');
    let l = (result.locations.length);
    let latest = result.locations[l-1];
    console.log(l);
    return res.json({latest});
})*/

router.get('/map/:id', async (req, res) => {
    const agencyId = req.params.id;
    const result = await Delivery.find({ agencyId: agencyId });
    const agencyName = await Agency.findById(agencyId).select('agencyName -_id');
    
    if(_.isEmpty(result, true)){
        return res.send('You have not created any delivery')
    }

    const map = true;
    return res.render('./dashboard/agency/map/googleMap', {
        agencyId,
        map,
        agencyName
    });
});

router.get('/vehicle/:id', async (req, res) => {
    try {
        const locations = [];
        const agencyId = req.params.id;
        const result = await Delivery.find({ agencyId: agencyId }).and({isCompleted: false});
        const online = _.filter(result, l => !(_.isEmpty(l.locations, true)));   //filter active driver
        
        if((_.isEmpty(online, true))){
            
            return res.send('There is no active driver for your delivery');
        }
            online.forEach(element => {                     //getting lat location of vehicle
                let l = element.locations.length;
                const location = element.locations[l - 1];
                locations.push(location);
            });
            return res.send(locations);


    } catch (ex) {
        console.log(ex.message);
    }
});

async function addLocation(deliveryId, location) {
    const delivery = await Delivery.findOne({ _id: deliveryId });
    console.log('delivery2', delivery);
    delivery.locations.push(location);
    await delivery.save();
    return delivery.locations;
}

module.exports = router;
