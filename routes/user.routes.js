const express = require("express")
const router = express.Router()
const userController = require("../controllers/user.controller")
const { authenticate, isSuperAdmin } = require("../middleware/authMiddleware")

router.post("/create", authenticate, isSuperAdmin, userController.createUser)
router.get("/confirm/:token", userController.confirmAccount)
router.get("/", authenticate, isSuperAdmin, userController.getAllUsers)

module.exports = router

