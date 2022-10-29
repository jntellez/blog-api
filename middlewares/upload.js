const multer = require('multer')

const uploadFile = () => {
    const storage = multer.diskStorage({
        destination: './public/uploads',
        filename: (_req, file, cb) => {
            const extension = file.originalname.slice(file.originalname.lastIndexOf('.'))
            cb(null, Date.now() + extension)
        }
    })

    const upload = multer({ storage }).single('file')

    return upload
}

module.exports = uploadFile