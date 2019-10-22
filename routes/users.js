const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

//Login
router.get('/login', (req, res) => {
    res.render('login')
})

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// Register View
router.get('/register', (req, res) => {
    res.render('register')
})

// Register user
router.post('/register', async (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body
    let errors = []
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: "Form is missing information"
        })
    }
    if (password != password2) {
        errors.push({
            msg: "Passwords do no match"
        })
    }
    if (password.length < 6) {2z    q
        errors.push({
            msg: "Password is too short"
        })
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation Passed
        const user = await User.findOne({
            email: email
        })
        console.log(user)
        if (user) {
            // User exists - throw error
            errors.push({
                msg: 'User already exists'
            })
            console.log("User already exists")
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            })
        } else {
            const newUser = new User({
                name: name,
                email: email,
                password: password
            })
            try {
                const salt = bcrypt.genSaltSync(10)
                console.log(newUser)
                const hash = await bcrypt.hash(newUser.password, salt)
                console.log(hash)
                newUser.password = hash;
            } catch (err) {
                res.status(500).send(err)
            }
            await newUser.save()
            req.flash('success_msg', 'You are now registered');
            res.redirect('/users/login')
        }
    }
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})


module.exports = router;