const router = require("express").Router()
const authController = require("../controllers/authController")
const validationMiddleware = require("../middleware/validationMiddleware")

router.get("/login", authController.login)
router.post("/login", authController.loginPost)


router.get("/register", authController.register)
router.post("/register", validationMiddleware.validateNewUser(), authController.registerPost)


router.get("/forget-password", authController.forgetPassword)
router.post("/forget-password", authController.forgetPasswordPost)

module.exports = router