const express = require('express');
const router = express.Router();
const restricted = require('../auth/restricted-middleware')

const Users = require('./users-model')


router.get('/', restricted, onlyDepartment('Ios'), (req, res) => {
    Users.get()
    .then(users => {
        res.json(users)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({message: 'Could not get users'})
    }) 
})

function onlyDepartment(department) {
    return function(req, res, next) {
        console.log(req.user.department)
        if(req.user && req.user.department && req.user.department.toLowerCase() === department) {
            next();
        } else {
            res.status(403).json({message: 'Sorry, wrong department'})
        }
    }
}

module.exports = router;