const {body} = require("express-validator")

const validateAddProduct = () => {
    return [
        body("productDetail")
            .trim()
            .isLength({max:1000}).withMessage("You can enter up to 1000 characters.")
    ]
}

module.exports = {
    validateAddProduct
}