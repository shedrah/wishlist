const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest} = require('../middleware/auth')

const Game = require('../models/Game')
// Login page
// GET /

router.get('/', ensureGuest, (req, res) =>{
    res.render('login', {layout: "login",})
})

// Dashboard/users page
// GET /dashboard

router.get('/dashboard', ensureAuth, async(req, res)=>{
    try{
        const games = await Game.find({user: req.user.id}).lean()
        res.render('dashboard',{
            name: req.user.displayName,
            games,
        })
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
})
module.exports = router