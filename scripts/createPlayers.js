const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

const fs = require('fs')

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
    const {
      id,
      rev
    } = body

    const {
      asset
    } = player
    const content_type = 'image/png'

    const playerAssetPath = '../data/assets/players/' + asset
    fs.readFile(playerAssetPath, (err, data) => {
      gunnersDb.attachment.insert(
        id,
        'player.png',
        data,
        content_type,
        {
          rev
        }
      ).then(body => {
        const {
          id,
          rev
        } = body

        const playerBigAssetPath = '../data/assets/players_big/' + asset
        fs.readFile(playerBigAssetPath, (err, data) => {
          gunnersDb.attachment.insert(
            id,
            'player_big.png',
            data,
            content_type,
            {
              rev
            }
          ).then(body => {
            console.log('insert success: ', player)
          })
        })
      })
    })
  })
})
