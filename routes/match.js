const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

module.exports = {
  create: (req, res, next) => {
    const params = getPostParams(req, res)

    if (!params) return

    gunnersDb.insert(params)
    .then(body => {
      res.send(body)
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
      console.log('match updated!')
      res.send({
        success: body.ok
      })
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
      console.log('match deleted!')
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

    if (!opponent.title || !opponent.asset) {
      res.status(400).send('opponent must be of format: { title: string, asset: string }')
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
