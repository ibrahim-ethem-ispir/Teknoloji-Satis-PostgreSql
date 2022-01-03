const router = require("express").Router()
const adminController = require("../controllers/adminController")
const authMiddleware = require("../middleware/authMiddleware")
const multerConfig = require("../config/multerConfig")
const validationMiddleware = require("../middleware/validationMiddleware")
const validationProduct = require("../middleware/productMiddleware")


router.get("/",authMiddleware.ifTheSessionIsOpen , authMiddleware.loggedInAdmin,adminController.admin)

router.get("/profile",authMiddleware.ifTheSessionIsOpen, authMiddleware.loggedInAdmin, adminController.profile)

router.post("/profile-update",authMiddleware.ifTheSessionIsOpen, authMiddleware.loggedInAdmin,multerConfig.userImages.single("profileImg"),validationMiddleware.validateNewPassword() ,adminController.profileUpdate)

router.get("/add-product", authMiddleware.ifTheSessionIsOpen, authMiddleware.loggedInAdmin, adminController.addProduct)

router.post("/add-product", authMiddleware.ifTheSessionIsOpen, authMiddleware.loggedInAdmin, multerConfig.productImage.single("productImage"), authMiddleware.loggedInAdmin,validationProduct.validateAddProduct() ,adminController.addProductPost)

// administrators
router.get("/administrators", authMiddleware.ifTheSessionIsOpen, authMiddleware.loggedInManager,adminController.administrators)

module.exports = router