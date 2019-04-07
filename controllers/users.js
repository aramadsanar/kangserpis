const _ = require('lodash');
const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const usersDao = require('../dao/usersDao')
const validateJwt = require('../middleware/auth')

router.post('/create', (req, res) => {

})

router.post('/authenticate', (req, res) => {

})

router.get('/authenticationStatus', validateJwt, (req, res) => {
    if (req.user) {
        res.send(req.user)
    } else {
        res.send("You are not logged in as users")
    }
})


module.exports = router;