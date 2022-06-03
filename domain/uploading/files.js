const { ResponseUtil } = require('../../internal/utils')
const multer = require('multer')
const mimetypes = require('mime-types')
const UrlParse = require('url-parse')
const config = require('../../internal/config').Var
const fs = require('fs')
const validDir = {
  lpj: true,
}

const handler = ({}) => {
  return {
    UploadFileHandler: async (req, res, next) => {
      try {
        const { dest } = req.body

        return res.send(
          ResponseUtil.RespJSONOk({
            file: UrlParse(
              `${config.Host}/files/${dest}/${req.file.filename}`
            ).toString(),
          })
        )
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = ({ httpTool, userService }) => {
  const { httpRouter, middleware } = httpTool
  const h = handler({})
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const { dest } = req.body
        const dir = `public/${dest}`

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir)
        }

        cb(null, dir)
      },
      filename: function (req, file, cb) {
        const { dest } = req.body
        const newname = `${Date.now()}-${dest}-${Math.round(
          Math.random() * 1e9
        )}`

        cb(null, `${newname}.${mimetypes.extension(file.mimetype)}`)
      },
    }),
    fileFilter: function (req, file, cb) {
      const { dest } = req.body

      // console.log('TODO: validate the mime type upload here !!!')
      if (!dest || !validDir[dest]) {
        cb(new Error('Invalid Destination'))
      }

      cb(null, true)
    },
  })

  httpRouter.post(
    '/api/upload/file',
    [middleware.JWTAuth, upload.single('uploaded_file')],
    h.UploadFileHandler
  )
}
