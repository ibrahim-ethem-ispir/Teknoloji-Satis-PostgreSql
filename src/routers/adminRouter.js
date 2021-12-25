const router = require("express").Router()
const adminController = require("../controllers/adminController")
const authMiddleware = require("../middleware/authMiddleware")
const multerConfig = require("../config/multerConfig")
const validationMiddleware = require("../middleware/validationMiddleware")
const validationProduct = require("../middleware/productMiddleware")


router.get("/",authMiddleware.ifTheSessionIsOpen ,adminController.admin)

router.get("/profile",authMiddleware.ifTheSessionIsOpen, adminController.profile)

router.post("/profile-update",authMiddleware.ifTheSessionIsOpen,multerConfig.adminProfileImage.single("profileImg"),validationMiddleware.validateNewPassword() ,adminController.profileUpdate)

router.get("/add-product", authMiddleware.ifTheSessionIsOpen, adminController.addProduct)

router.post("/add-product", authMiddleware.ifTheSessionIsOpen, multerConfig.productImage.single("productImage"),validationProduct.validateAddProduct() ,adminController.addProductPost)

module.exports = router