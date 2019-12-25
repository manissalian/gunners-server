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
const upload = require('./routes/upload.js')
const asset = require('./routes/asset.js')
const stats = require('./routes/stats.js')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.post('/match/create', match.create)
app.post('/match/update', match.update)
app.delete('/match/delete', match.delete)
app.get('/match/all', match.getAll)
app.get('/match/next', match.getNext)
app.get('/match/player/:id', match.byPlayerId)
app.get('/match/:id', match.getById)

app.get('/player/all', player.getAll)
app.post('/player/create', player.create)
app.get('/player/:id', player.getById)

app.get('/podium/goals', podium.getGoals)
app.get('/podium/assists', podium.getAssists)

app.get('/leagueTable', leagueTable.get)
app.post('/leagueTable/update', leagueTable.update)

app.post('/upload/file', upload.file)

app.get('/asset/:id', asset.getById)

app.get('/stats/table', stats.getTable)

module.exports = app
