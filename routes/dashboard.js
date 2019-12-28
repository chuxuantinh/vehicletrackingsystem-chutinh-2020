const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Agency } = require('../models/agency');
const { Driver } = require('../models/driver');
const { Delivery } = require('../models/delivery');
const _ = require('lodash');
const token  =require('../middleware/token');

router.get('/agency/:id', token, async (req, res) =>  {
    try{
        const agencyId = req.params.id;
        let totalMaterialCount = 0, totalDeliveryCount, deliveryCompleted;
        const totalDelivery= await Delivery.find({agencyId: req.params.id}).select('-_id'); //total deliveries
        const totalDriver= await Driver.find({agencyId: req.params.id}).select('agencyId'); //5c9124b5f15da80444ed143b
        let agencyName = await Agency.findOne({_id: agencyId}).select('agencyName -_id');

        if(!totalDelivery){
            totalDeliveryCount = 0;
            deliveryCompleted = false;
        }
        if(!totalDriver){
            totalDriverCount = 0;
        }
        if(totalDelivery){          //if deliviers return object more or qual to 1
            deliveryCompleted = _.filter(totalDelivery, c => c.isCompleted === true);        //Completed Delivery
            totalDeliveryCount = totalDelivery.length;
            
            totalDelivery.forEach(element => {          //Count Of Total Material
                if(!element.totalMaterial){
                   element.totalMaterial = 0;
                }0
                totalMaterialCount = totalMaterialCount + element.totalMaterial  
            });
        }
        if(totalDriver){
            totalDriverCount = totalDriver.length;
        }
        
         return res.status(200).render('./dashboard/agency/dashboard', {
             totalDeliveryCount: totalDeliveryCount,
             totalMaterialCount: totalMaterialCount,
             totalDriverCount: totalDriverCount,
             deliveryCompleted: deliveryCompleted,
             agencyId: agencyId,
             agencyName: agencyName
         });

    }catch(ex){
        return res.json(ex.message);
    }
});

router.get('/driver/:id', token,  async (req, res) => {
    let totalDriverDelivery;    //count number of deliveries by driver
    const driverId = req.params.id; //getting driverId
    const driverName  = await Driver.findById(driverId).select('firstName -_id');
    const driverDelivery = await Delivery.find({driverId: driverId});
    let count = driverDelivery.length;

    if(count<1){
        return res.json({
            DriverDelivery: false
        })
    }

    if(driverDelivery){
        let driverCompletedDelivery, driverIncompletedDelivery, driverCompletedDeliveryCount, driverIncompletedDeliveryCount;
        driverCompletedDelivery = _.filter(driverDelivery, c => c.isCompleted === true);        //Completed Delivery by Driver
        driverIncompletedDelivery = _.filter(driverDelivery, i => i.isCompleted === false);     //Incompleted Delivery by Driver

        driverCompletedDeliveryCount = driverCompletedDelivery.length;
        driverIncompletedDeliveryCount = driverIncompletedDelivery.length

        return res.render('./dashboard/driver/dashboardDriver', {
            driverId,
            driverName,
            driverCompletedDeliveryCount,
            driverIncompletedDeliveryCount
        });
        
    }
});



module.exports = router;