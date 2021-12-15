const router = require("express").Router()
const adminController = require("../controllers/adminController")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/",authMiddleware.ifTheSessionIsOpen ,adminController.admin)

module.exports = router