const express = require('express')
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { jwtSecret } = require('../config/secret')
const bc = require('bcryptjs')

const Users = require('../users/users-model')

router.post('/register', (req, res) => {
    const user = req.body;
    const hash = bc.hashSync(user.password, 10) // 2 ^ n(10)
    user.password = hash;

    Users.insert(user)
    .then(saved => {
        res.status(201).json(saved)
    })
    .catch( err => {
        console.log(err)
        res.status(500).json({message: 'Who are you? Could not register'})
    })
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    Users.getBy({ username })
    .first()
    .then(user => {
        if(user && bc.compareSync(password, user.password)) {
            const token = signToken(user);
            res.status(200).json({ token })
        } else {
            res.status(401).json({message: 'Password or user name is wrong:'})
        }
    })
    .catch( err => {
        console.log(err)
        res.status(500).json({message: 'Cound not log in '})
    })
})

function signToken(user) {
    const payload = {
        userId: user.id,
        username: user.username,
        department: user.department
    }
    const options = {
        expireIn: '1d'
    }
    return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;