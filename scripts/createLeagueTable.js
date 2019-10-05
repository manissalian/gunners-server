const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

const fs = require('fs')

const leagueTable = require('../data/leagueTable.js')
const teams = leagueTable.teams
const id = leagueTable._id

const promises = teams.map(team => {
  const name = team.asset
  const content_type = 'image/svg+xml'
  const path = '../data/assets/logos/' + name

  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      const attachment = {
        data,
        name,
        content_type
      }

      resolve(attachment)
    })
  })
})

Promise.all(promises).then(responses => {
  gunnersDb.multipart.insert(
    { teams },
    responses,
    id
  ).then(body => {
    console.log('league table inserted')
  })
})