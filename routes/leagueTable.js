const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

module.exports = {
  get: (req, res, next) => {
    gunnersDb.get('leagueTable', {
      include_docs: true
    }).then(body => {
      const teams = body.teams.sort((teamA, teamB) => {
        return teamA.position - teamB.position
      })

      const response = {
        ...body,
        teams
      }

      res.send(body)
    })
  },

  update: (req, res, next) => {
    if (!req.body.teams) {
      res.status(400).send('Must pass teams as post data param')
      return
    }

    const teams = req.body.teams

    gunnersDb.get('leagueTable', {
      include_docs: true
    }).then(body => {
      const {
        _id,
        _rev
      } = body

      gunnersDb.insert({
        _id,
        _rev,
        teams
      })
      .then(body => {
        console.log('league updated!')
        res.send({
          success: body.ok
        })
      })
    })
  }
}
