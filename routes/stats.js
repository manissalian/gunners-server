const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

module.exports = {
  getTable: (req, res, next) => {
    const players = gunnersDb.view('player', 'byNumber', {
      include_docs: true
    })

    const matches = gunnersDb.view('match', 'byOpponent', {
      include_docs: true
    })

    Promise.all([players, matches]).then(responses => {
      const players = {}
      responses[0].rows.map(player => {
        players[player.id] = {
          ...player.doc,
          stats: {
            starts: 0,
            subs: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goals: 0,
            assists: 0
          }
        }
      })

      const matches = responses[1].rows.map(match => match.doc)
      matches.map(match => {
        if (match.result === 'pending') return

        match.players.map(playerId => {
          players[playerId].stats.starts += 1

          resolveResult(match.result, players[playerId].stats)
        })

        match.subs.map(playerId => {
          players[playerId].stats.subs += 1

          resolveResult(match.result, players[playerId].stats)
        })

        match.goals.map(goalData => {
          const {
            goal,
            assist
          } = goalData

          if (typeof players[goal] != 'undefined') {
            players[goal].stats.goals += 1
          }

          if (typeof players[assist] != 'undefined') {
            players[assist].stats.assists += 1
          }
        })

        function resolveResult (result, statsObject) {
          switch(result) {
            case 'win':
              statsObject.wins += 1
              break
            case 'draw':
              statsObject.draws += 1
              break
            case 'lose':
              statsObject.losses += 1
              break
          }
        }
      })

      res.send(players)
    })
  }
}
