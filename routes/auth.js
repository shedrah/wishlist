const express = require('express')
const router = express.Router()
const passport = require('passport')
// Auth with Google
// GET /auth/google

router.get('/google', passport.authenticate('google',{scope: ['profile']}))

// Google auth callback
// GET /auth/google/callback

router.get('/google/callback', passport.authenticate('google', {failureRedirect:
'/'}), (req, res) =>{
    res.redirect('/dashboard')
})

// LOGOUT
// /auth/logout

router.get('/logout', (req, res, next) => {
    req.logout((error)=>{
        if (error) {return next(error)}
        res.redirect('/')
    });  
})

module.exports = router