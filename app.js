const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const app = express()
const cors = require('cors')

const match = require('./routes/match.js')
const player = require('./routes/player.js')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.get('/match/all', match.getAll)
app.get('/match/next', match.getNext)
app.post('/match/create', match.create)

app.get('/player/all', player.getAll)
app.post('/player/create', player.create)

module.exports = app
