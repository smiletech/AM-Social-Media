const multer = require('multer')
const path = require("path")


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "image")
    },
    filename: (req, file, cb) => {
        console.log(file);
        if (file)
            cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

module.exports = upload.single("image")