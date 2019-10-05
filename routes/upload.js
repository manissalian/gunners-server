const nano = require('nano')('http://localhost:5984')
const gunnersDb = nano.use('gunners')

const multer = require('multer')
const dest = 'temp/uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dest)
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
const upload = multer({ storage }).single('file')

module.exports = {
  file: (req, res, next) => {
    upload(req, res, err => {
      const file = req.file

      res.send({
        path: dest + '/' + file.filename
      })
    })
  }
}
