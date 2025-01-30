const express = require("express")
const router = express.Router()
const caseController = require("../controllers/case.controller")
const { authenticate } = require("../middleware/authMiddleware")
const { checkPermission } = require("../middleware/permissionMiddleware")

router.post("/", authenticate, checkPermission("create_case"), caseController.createCase)
router.get("/", authenticate, caseController.getAllCases)
router.get("/:id", authenticate, caseController.getCase)
router.put("/:id", authenticate, checkPermission("update_case"), caseController.updateCase)
router.delete("/:id", authenticate, checkPermission("delete_case"), caseController.deleteCase)
router.post("/:id/assign", authenticate, checkPermission("assign_case"), caseController.assignCase)
router.post("/:id/respond", authenticate, caseController.addResponse)

module.exports = router

