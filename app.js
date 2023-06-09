const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv =  require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require("connect-mongo")
const connectDB = require('./config/db')


// Load config
dotenv.config({path: './config/config.env'})
// Passport config
require('./config/passport')(passport)
connectDB()
const app = express()

// Form parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

// Global express variable
app.use(function(req, res, next){
    res.locals.user = req.user || null
    next()
})

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}
// Handlebars helper
const {formatDate, editIcon} = require('./helpers/hbs')


// Handlebars
app.engine('.hbs', exphbs.engine({helpers: {
    formatDate,
    editIcon,
}, defaultLayout: "main", extname: '.hbs'}));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false, //only save when new data
    store: MongoStore.create({
        mongoUrl:process.env.MONGO_URI,
        mongooseConnection: mongoose.connection})
  }))


// Passport
app.use(passport.initialize())
app.use(passport.session())

// Moongose get stats
const gameId = "63e01a9fc2b6f300b222aef7"
const findByGameId = (gameId) =>
  mongoose.Model.findById({_id: gameId})



// static folder
app.use(express.static(path.join(__dirname,'public')))


//ROUTES

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/games', require('./routes/games'))

const PORT = process.env.PORT || 3000


app.listen(PORT,
     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

     //npm run dev


// TODO
// 1. Stats
// 2. Landing page