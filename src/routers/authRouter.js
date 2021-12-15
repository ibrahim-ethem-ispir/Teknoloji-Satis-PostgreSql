const router = require("express").Router()
const authController = require("../controllers/authController")
const validationMiddleware = require("../middleware/validationMiddleware")
const authMiddleware = require("../middleware/authMiddleware")

// admin
router.get("/admin-login",authMiddleware.ifLoggedOut, authController.login)
router.post("/admin-login",authMiddleware.ifLoggedOut,validationMiddleware.validateLogin() ,authController.loginPost)


router.get("/admin-register",authMiddleware.ifLoggedOut, authController.register)
router.post("/admin-register",authMiddleware.ifLoggedOut, validationMiddleware.validateNewUser(), authController.registerPost)


router.get("/admin-forget-password",authMiddleware.ifLoggedOut, authController.forgetPassword)
router.post("/admin-forget-password",authMiddleware.ifLoggedOut, authController.forgetPasswordPost)

router.get("/admin-logout", authMiddleware.ifTheSessionIsOpen, authController.adminLogout)

module.exports = router