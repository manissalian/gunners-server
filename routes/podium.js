const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

module.exports = {
  getGoals: (req, res, next) => {
    gunnersDb.view('match', 'byOpponent', {
      include_docs: true
    }).then(body => {
      const matchRows = body.rows

      let goalScorers = {}
      matchRows.forEach(row => {
        const goals = row.doc.goals

        goals.forEach(goal => {
          const scorer = goal.goal

          goalScorers[scorer] = goalScorers[scorer] ? goalScorers[scorer] + 1 : 1
        })
      })

      res.send(goalScorers)
    })
  },

  getAssists: (req, res, next) => {
    gunnersDb.view('match', 'byOpponent', {
      include_docs: true
    }).then(body => {
      const matchRows = body.rows

      let assistants = {}
      matchRows.forEach(row => {
        const goals = row.doc.goals

        goals.forEach(goal => {
          const assistant = goal.assist

          if (!assistant) return

          assistants[assistant] = assistants[assistant] ? assistants[assistant] + 1 : 1
        })
      })

      res.send(assistants)
    })
  }
}
