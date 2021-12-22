const router = require("express").Router()
const adminController = require("../controllers/adminController")
const authMiddleware = require("../middleware/authMiddleware")
const multerConfig = require("../config/multerConfig")
const validationMiddleware = require("../middleware/validationMiddleware")

router.get("/",authMiddleware.ifTheSessionIsOpen ,adminController.admin)

router.get("/profile",authMiddleware.ifTheSessionIsOpen, adminController.profile)

router.post("/profile-update",authMiddleware.ifTheSessionIsOpen,multerConfig.single("profileImg"),validationMiddleware.validateNewPassword() ,adminController.profileUpdate)

module.exports = router