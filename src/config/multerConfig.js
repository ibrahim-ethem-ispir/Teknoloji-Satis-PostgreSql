const multer = require("multer")
const path = require("path")

const myStrorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/adminProfileImg"))
    },
    filename: (req, file, cb) => {
        console.log(req.user.email);
        // burada dosya adımızı oluşturalım
        cb(null, req.user.email + "" + path.extname(file.originalname))
    }
})

// burada hangi tür dosyaları yükleyebileceklerini belirtiyoruz
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}


const myStrorageProduct = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/productImage"))
    },
    filename: (req, file, cb) => {
        console.log("product name === "+req.body.productName);
        console.log("product code === "+req.body.productCode);
        // burada dosya adımızı oluşturalım
        cb(null, req.body.productName + "" +req.body.productCode+ "" +path.extname(file.originalname))
    }
})


const adminProfileImage = multer({ storage: myStrorage, fileFilter: imageFileFilter })
const productImage = multer({ storage: myStrorageProduct, fileFilter: imageFileFilter })


module.exports = {
    adminProfileImage,
    productImage
}
