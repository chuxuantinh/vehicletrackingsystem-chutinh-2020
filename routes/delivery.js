const _ = require('lodash');
const token = require('../middleware/token');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Delivery, validator } = require('../models/delivery');
const { Driver } = require('../models/driver');
const { Agency } = require('../models/agency');

router.get('/create/:id', token, async (req, res)  => {
    try{
        const agencyId = req.params.id;
        const driver = await Driver.find({agencyId: agencyId}).select('_id firstName lastName'); 
        const agencyName = await Agency.findById(agencyId).select('agencyName -_id');
        return res.render('./dashboard/agency/createDelivery', {
            agencyId,
            driver,
            agencyName
        });
    }catch(ex){
        return res.send(ex.message);
    }
});

router.post('/create', token, async (req, res) => {
    const {error} = validator(req.body);
    if(error){ return res.status(400).send(error.details[0].message); }

   if(!error){
       try{
        let delivery = await new Delivery(_.pick(req.body, ['agencyId', 'driverId', 'vType', 'vNumber', 'vCapacity', 'vBrand', 'totalMaterial', 'fLocation', 'tLocation']));
        let result = await delivery.save();
        return res.status(200).redirect('/delivery/list/'+result.agencyId);
       }
       catch(ex){ return res.status(400).send(ex.message); }  
    }
}
);

router.get('/list/:id', token, async (req, res) => {
    try{
        const agencyId = req.params.id;
        const delivery = await Delivery.find({agencyId: agencyId});
        const agencyName = await Agency.findById(agencyId).select('agencyName -_id');
        if(!delivery){
            return res.send('You Does not have any Delivery');
        }

        return res.status(200).render('./dashboard/agency/listDelivery', {
            delivery,
            agencyId,
            agencyName
        })
    }catch(ex){
        return res.send(ex.message);
    }
});

router.get('/completed/:id', async (req, res) => {
    const driverId = req.params.id; //getting driverId
    const result = await Delivery.find({driverId: driverId});

    if(result.length < 1){
        return res.render('./dashboard/driver/driver_completed', {
            noDelivery: true
        })
    }
    const completed = _.filter(result, i => i.isCompleted === true);
    return res.render('./dashboard/driver/driver_completed', {
        completedDelivery: completed
    })
});

router.get('/incompleted/:id', async (req, res) => {
    const driverId = req.params.id; //getting driverId
    const result = await Delivery.find({driverId: driverId});
    const driver = await Driver.findById(driverId);
    if(result.length < 1){
        return res.render('./dashboard/driver/incompletedDriver', {
            noDelivery: true,
            driver
        })
    }
    const incompleted = _.filter(result, i => i.isCompleted === false);
    return res.render('./dashboard/driver/incompletedDriver', {
        incompletedDelivery: incompleted,
        driver
    })
});

router.put('/mark/:id', async (req, res) => {
    const id = req.params.id;
    await Delivery.findOneAndUpdate(id, {
        $set: {
            isCompleted: true
        }
    });
    return res.redirect('back');
})

module.exports = router;