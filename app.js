const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const app = express()
const cors = require('cors')

const match = require('./routes/match.js')
const player = require('./routes/player.js')
const podium = require('./routes/podium.js')
const leagueTable = require('./routes/leagueTable.js')

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
app.get('/player/id', player.getById)
app.post('/player/create', player.create)

app.get('/podium/goals', podium.getGoals)
app.get('/podium/assists', podium.getAssists)

app.get('/leagueTable', leagueTable.get)
app.post('/leagueTable/update', leagueTable.update)

module.exports = app
