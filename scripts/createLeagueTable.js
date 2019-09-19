const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

const leagueTable = require('../data/leagueTable.js')

gunnersDb.insert(leagueTable)
.then(body => {
  console.log('match created!')
})