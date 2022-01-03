const router = require("express").Router()
const authController = require("../controllers/authController")
const validationMiddleware = require("../middleware/validationMiddleware")
const authMiddleware = require("../middleware/authMiddleware")

// admin
router.get("/login",authMiddleware.ifLoggedOut, authController.login)
router.post("/login",authMiddleware.ifLoggedOut,validationMiddleware.validateLogin() ,authController.loginPost)


router.get("/register",authMiddleware.ifLoggedOut, authController.register)
router.post("/register",authMiddleware.ifLoggedOut, validationMiddleware.validateNewUser(), authController.registerPost)


router.get("/forget-password",authMiddleware.ifLoggedOut, authController.forgetPassword)
router.post("/forget-password",authMiddleware.ifLoggedOut, validationMiddleware.validateEmail(),authController.forgetPasswordPost)

router.get("/logout", authMiddleware.ifTheSessionIsOpen, authController.adminLogout)

router.get("/verify",authController.verifyMail)

router.get("/reset-password/:id/:token",authController.adminResetPassword)
router.get("/reset-password",authController.adminResetPassword)
router.post("/reset-password",validationMiddleware.validateNewPassword() ,authController.adminResetPasswordPost)
/*
 buraya id ve token olmayan link yapmamızdaki sebep ise direk 
 bu adres e gidilirse mail deki link e tıkla yada yoken yok diye 
 hata mesajı yansıyacaktır
*/


module.exports = router