const _ = require('lodash');
const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const sellersDao = require('../dao/sellersDao')
const ordersDao = require('../dao/ordersDao')
const validateJwt = require('../middleware/auth')
const validations = require('./validations/orders')

router.post('/create', validateJwt, async (req, res) => {
    try {

        //must be user to create order!
        //else, that would have been crazy!
        if (req.user) {

            let {error} = validations['/create'](req.body)

            if (error) {
                return res.status(400).send(error)
            }

            let orderDetail = req.body

            //create order here

            // let user = await usersDao.getUserByPk(orderDetail.userId)
            // let seller = await sellersDao.getSellerByPk(orderDetail.sellerId)

            let newOrder = await ordersDao.createNewOrder(orderDetail)

            if (newOrder) return res.send(newOrder)
            else return res.status(500).send("unknown error")
        } else {
            return res.status(400).send("To create order, you must sign in as user.")
        }        
    } catch(err) {
        return res.status(500).send(err)
    }
})
router.get('/showSellerOrders', validateJwt, async (req, res) => {
    try {
        if (req.seller) {
            let body = req.body
            let {error} = validations['/showSellerOrders'](body)
    
                    
            if (error) {
                return res.status(400).send(error)
            }
    
            if (req.seller.id !== req.body.sellerId) {
                return res.status(403).send({
                    'error': 'You are not authorized to see this.'
                })
            }
    
            let result = await ordersDao.getSellerOrders(body.sellerId, body.pageNo, body.pageSize)
    
            return res.send(result)
        } else {
            res.send("You are not logged in as seller")
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }

})

router.post('/showUserOrders', validateJwt, async(req, res) => {
    try {
        if (req.user) {
            let body = req.body
            let {error} = validations['/showUserOrders'](body)
    
                    
            if (error) {
                return res.status(400).send(error)
            }
    
            if (req.user.id !== req.body.userId) {
                return res.status(403).send({
                    'error': 'You are not authorized to see this.'
                })
            }
    
            let result = await ordersDao.getUserOrders(body.sellerId, body.pageNo, body.pageSize)
    
            return res.send(result)
        } else {
            res.send("You are not logged in as seller")
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
})

module.exports = router;