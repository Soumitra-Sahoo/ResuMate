import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads/')
    },
    filename: (req, file , cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
})

//File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG, PNG and GIF are allowed.'), false)
    }
}

const upload = multer({storage, fileFilter})
export default upload;