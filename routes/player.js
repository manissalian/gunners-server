const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

module.exports = {
  create: (req, res, next) => {
    const {
      name,
      number,
      asset
    } = req.body

    if (!name || !number || !asset) {
      res.status(400).send('Make sure to pass name, number and asset')
      return
    }

    const params = {
      type: 'player',
      name,
      number,
      asset
    }

    gunnersDb.insert(params)
    .then(body => {
      res.send(body)
    })
  },

  getAll: (req, res, next) => {
    gunnersDb.view('player', 'byNumber', {
      include_docs: true
    }).then(body => {
      res.send(body)
    })
  },

  getById: (req, res, next) => {
    const id = req.query.id

    if (!id) {
      res.status(400).send('Make sure to pass player ID')
      return
    }

    gunnersDb.get(id, {
      include_docs: true
    }).then(body => {
      res.send(body)
    }).catch(err => {
      res.send(err.message)
    })
  }
}
