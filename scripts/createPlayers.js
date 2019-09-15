const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

const players = require('../data/players.js')

players.filter(player => {
  const {
    name,
    number,
    asset
  } = player

  const valid = name && number && asset !== undefined

  if (!valid) console.log(`${JSON.stringify(player)} is invalid`)

  return valid
}).map(player => {
  const fields = {
    type: 'player',
    ...player
  }

  gunnersDb.insert(fields)
  .then(body => {
    console.log('insert success: ', player)
    console.log(body)
  })
  .catch(err => {
    console.log('error on: ', player)
    console.log('error: ', err)
  })
})
