const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Game = require('../models/Game')

var accessToken = '';
const clientId = 'w90oqmu9u0of2vsh0xnv6qxivn8bko';
const gameName = 'your_game_name_here';


const data = new URLSearchParams();
data.append('client_id', 'w90oqmu9u0of2vsh0xnv6qxivn8bko');
data.append('client_secret', '548agyhmyp8eca5cc7xvyi6jcsn2t8');
data.append('grant_type', 'client_credentials');

const options = {
  method: 'POST',
  body: data,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

fetch('https://id.twitch.tv/oauth2/token', options)
  .then(response => response.json())
  .then(data => {
    accessToken = data.access_token
    // Do something with the access token, such as store it for later use
  })
  .catch(error => {
    console.error('Error exchanging authorization code for access token:', error);
  });
url = `https://api.twitch.tv/helix/games?name=${gameName}`;
const headers = {
  'Client-ID': clientId,
  'Authorization': `Bearer`+ accessToken,
  'grant_type': 'client_credentials'

};

// Show add game page
// GET /games/add

router.get('/add', ensureAuth, (req, res) =>{
    res.render('games/add')
})

// POST form
// POST /games
router.post('/', ensureAuth, async (req, res) => {
    try {
      req.body.user = req.user.id
      headers.Authorization = "Bearer"+` ${accessToken}`;
      url = `https://api.twitch.tv/helix/games?name=${req.body.title}`
      console.log(req.body.title)
      try{
        let gameUrl = await fetch(url, { headers })
        let gameJson = await gameUrl.json()
        req.body.image = gameJson.data[0].box_art_url.replace('{width}', '138').replace('{height}', '190');
      }catch{
        req.body.image = "https://static-cdn.jtvnw.net/ttv-static/404_boxart.jpg"
      }
      let game = await Game.create(req.body)
      res.redirect('/dashboard')
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })


// Show stats page
// GET /games

router.get('/', ensureAuth, async(req, res) =>{
  try{
      const games = await Game.find({genre: 'rpg'})
      //populate('user')
      //.sort({likes: 'desc'})
      //.lean()
      res.render('games/index',{
        games,
      })
  }catch(err){
    res.render('error/500')
  }
})
// Show edit page
// GET /games/edit/:id

router.get('/edit/:id', ensureAuth, async(req, res) =>{
  const game = await Game.findOne({
    _id: req.params.id
  }).lean()

  if(!game){
    return res.render('error/404')
  }

  if(game.user != req.user.id){
    res.redirect('/games')
  }else{
    res.render('games/edit',{
      game,
    })
  }
})
// Update game entry
// PUT /games/:id

router.put('/:id', ensureAuth, async(req, res) =>{
  let game = await Game.findById(req.params.id).lean()
  console.log("1") 
  try{
    if(!game){
      return res.render('error/404')
    }  
    if(game.user != req.user.id){
      console.log(game.user)
      res.redirect('/games')
    }else{
      console.log("2") 
      headers.Authorization = "Bearer"+` ${accessToken}`;
      url = `https://api.twitch.tv/helix/games?name=${game.title}`
      let gameUrl = await fetch(url, { headers })
      let gameJson = await gameUrl.json()
      req.body.image = gameJson.data[0].box_art_url.replace('{width}', '138').replace('{height}', '190'); 
      game = await Game.findOneAndUpdate(
        {_id: req.params.id},
        req.body, //send new data
        {new: true, runValidators: true})
        
      res.redirect('/dashboard')
      console.log("3")
    }
  }catch(err){
    console.error(err)
    return res.render('/dashboard')
  }
})

// Delete game
// DELETE /games/:id

router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id).lean()

    if (!game) {
      return res.render('error/404')
    }

    if (game.user != req.user.id) {
      res.redirect('/games')
    } else {
      await Game.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})




module.exports = router