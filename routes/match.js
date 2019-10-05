const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

const fs = require('fs')

module.exports = {
  create: (req, res, next) => {
    const params = getPostParams(req, res)

    if (!params) return

    gunnersDb.insert(params)
    .then(body => {
      const opponentAsset = req.body.opponentAsset

      if (opponentAsset) {
        const {
          path,
          type
        } = opponentAsset

        fs.readFile(path, (err, data) => {
          if (!data) res.send(body)

          const {
            id,
            rev
          } = body
          const attachmentName = 'opponentLogo'
          gunnersDb.attachment.insert(
            id,
            attachmentName,
            data,
            type,
            {
              rev
            })
          .then(attachmentBody => {
            fs.unlinkSync(path)
            res.send(body)
          })
        })
      } else {
        res.send(body)
      }
    })
  },

  update: (req, res, next) => {
    const params = getPostParams(req, res)

    if (!params) return

    const {
      _id,
      _rev
    } = req.body

    gunnersDb.insert({
      _id,
      _rev,
      ...params
    })
    .then(body => {
      const opponentAsset = req.body.opponentAsset

      if (opponentAsset) {
        const {
          path,
          type
        } = opponentAsset

        fs.readFile(path, (err, data) => {
          if (!data) res.send(body)

          const {
            id,
            rev
          } = body
          const attachmentName = 'opponentLogo'
          gunnersDb.attachment.insert(
            id,
            attachmentName,
            data,
            type,
            {
              rev
            })
          .then(attachmentBody => {
            fs.unlinkSync(path)
            res.send(body)
          })
        })
      } else {
        res.send(body)
      }
    })
  },

  delete: (req, res, next) => {
    const {
      _id,
      _rev
    } = req.body

    gunnersDb.destroy(
      _id,
      _rev
    ).then(body => {
      res.send({
        success: body.ok
      })
    })
  },

  getAll: (req, res, next) => {
    gunnersDb.view('match', 'byOpponent', {
      include_docs: true
    }).then(body => {
      res.send(body)
    })
  },

  getNext: (req, res, next) => {
    gunnersDb.view('match', 'byOpponent', {
      include_docs: true
    }).then(body => {
      const rows = body.rows

      rows.sort((rowA, rowB) => {
        return new Date(rowA.doc.date) - new Date(rowB.doc.date)
      })

      const unplayedMatches = rows.filter(row => {
        return row.doc.result === 'pending'
      })

      res.send(unplayedMatches[0])
    })
  },

  byPlayerId: (req, res, next) => {
    const id = req.params.id

    gunnersDb.view('match', 'byOpponent', {
      include_docs: true
    }).then(body => {
      const rows = body.rows
      const filteredRows = rows.filter(row => {
        return row.doc.players.includes(id) || row.doc.subs.includes(id)
      })
      res.send(filteredRows)
    })
  },

  getById: (req, res, next) => {
    const id = req.params.id

    gunnersDb.view('match', 'byOpponent', {
      include_docs: true
    }).then(body => {
      const match = body.rows.find(row => {
        return row.doc._id === id
      })

      res.send(match)
    })
  }
}

const getPostParams = (req, res) => {
  const {
      players,
      subs,
      goals,
      opponent,
      result,
      ground,
      tournament,
      date
    } = req.body

    if (!opponent || !tournament) {
      res.status(400).send('Make sure to pass opponent and tournament')
      return
    }

    return {
      type: 'match',
      players,
      subs,
      goals,
      opponent,
      result,
      ground,
      tournament,
      date
    }
}
