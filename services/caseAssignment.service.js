const Case = require("../models/case.model")
const User = require("../models/user.model")

const caseAssignmentService = {
  async assignCase(caseId, userId) {
    const caseItem = await Case.findById(caseId)
    const user = await User.findById(userId)

    if (!caseItem || !user) {
      throw new Error("Case or User not found")
    }

    if (!caseItem.assignedUsers.includes(userId)) {
      caseItem.assignedUsers.push(userId)
      await caseItem.save()
    }

    if (!user.assignedCases.includes(caseId)) {
      user.assignedCases.push(caseId)
      await user.save()
    }
  },

  async getCasesForUser(userId) {
    const user = await User.findById(userId).populate("role")
    if (user.role.name === "superAdmin") {
      return Case.find().populate("createdBy", "username").populate("assignedUsers", "username")
    } else {
      return Case.find({ assignedUsers: userId })
        .populate("createdBy", "username")
        .populate("assignedUsers", "username")
    }
  },

  async canAccessCase(userId, caseId) {
    const user = await User.findById(userId).populate("role")
    if (user.role.name === "superAdmin") {
      return true
    }
    const caseItem = await Case.findById(caseId)
    return caseItem.assignedUsers.includes(userId)
  },
}

module.exports = caseAssignmentService

