const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

module.exports = {
  getById: (req, res, next) => {
    const id = req.params.id
    const attachmentName = req.query.asset

    const readStream = gunnersDb.attachment.getAsStream(
      id,
      attachmentName
    )

    readStream.pipe(res)
  }
}
