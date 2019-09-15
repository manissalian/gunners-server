const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

module.exports = {
  create: (req, res, next) => {
    const {
      players,
      subs,
      teamGoals,
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

    if (!opponent.name || !opponent.asset) {
      res.status(400).send('opponent must be of format: { name: string, asset: string }')
      return 
    }

    const params = {
      type: 'match',
      players: players || [],
      subs: subs || [],
      teamGoals: teamGoals || [],
      opponent: {
        ...opponent,
        goals: 0
      },
      result: result || null,
      ground: {
        type: ground && ground.type || null,
        name: ground && ground.name || null
      },
      tournament,
      date: date || null
    }

    gunnersDb.insert(params)
    .then(body => {
      res.send(body)
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
        return row.doc.result == null
      })

      res.send(unplayedMatches[0])
    })
  }
}
