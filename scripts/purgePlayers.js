const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

gunnersDb.view('player', 'byNumber', {
  include_docs: true
})
.then(body => {
  body.rows.map(item => {
    gunnersDb.destroy(item.doc._id, item.doc._rev)
    .then(body => {
      console.log(body)
    })
  })
})