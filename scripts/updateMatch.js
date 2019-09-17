const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

const match = require('../data/match.js')

const playerNumbers = match.players
const subNumbers = match.subs
let goals = match.goals

const {
  opponent,
  result,
  ground,
  tournament,
  date
} = match

gunnersDb.view('player', 'byNumber', {
  include_docs: true
}).then(body => {
  const allPlayerRows = body.rows

  let players = []
  let subs = []

  allPlayerRows.forEach(row => {
    const doc = row.doc

    if (playerNumbers.includes(doc.number)) {
      players.push(doc._id)
    }

    if (subNumbers.includes(doc.number)) {
      subs.push(doc._id)
    }

    goals.forEach((goal, i) => {
      const scorer = goal.goal
      const assistant = goal.assist

      if (scorer === doc.number) {
        goals[i].goal = doc._id
      }

      if (assistant === doc.number) {
        goals[i].assist = doc._id
      }
    })
  })

  const fields = {
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

  gunnersDb.view('match', 'byOpponent', {
    key: opponent.title,
    include_docs: true
  }).then(body => {
    const rows = body.rows

    const row = rows.filter(row => {
      return row.doc.result === null
    })[0]

    const {
      _id,
      _rev
    } = row.doc

    gunnersDb.insert({
      _id,
      _rev,
      ...fields
    })
    .then(body => {
      console.log('match updated!')
      console.log(body)
    })
  })
})
