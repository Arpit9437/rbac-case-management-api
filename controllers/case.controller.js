const Case = require("../models/case.model")
const User = require("../models/user.model")
const caseAssignmentService = require("../services/caseAssignment.service")

const caseController = {
  async createCase(req, res) {
    try {
      const { athleteName, sport } = req.body
      const newCase = new Case({
        athleteName,
        sport,
        createdBy: req.user.id,
        status: "open",
      })
      await newCase.save()
      res.status(201).json(newCase)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async getAllCases(req, res) {
    try {
      const cases = await caseAssignmentService.getCasesForUser(req.user.id)
      res.json(cases)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getCase(req, res) {
    try {
      const caseItem = await Case.findById(req.params.id)
      if (!caseItem) {
        return res.status(404).json({ error: "Case not found" })
      }
      if (!(await caseAssignmentService.canAccessCase(req.user.id, caseItem._id))) {
        return res.status(403).json({ error: "Access denied" })
      }
      res.json(caseItem)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async updateCase(req, res) {
    try {
      const { status, testResults, reports } = req.body
      const caseItem = await Case.findById(req.params.id)
      if (!caseItem) {
        return res.status(404).json({ error: "Case not found" })
      }
      if (!(await caseAssignmentService.canAccessCase(req.user.id, caseItem._id))) {
        return res.status(403).json({ error: "Access denied" })
      }
      caseItem.status = status || caseItem.status
      if (testResults) caseItem.testResults.push(...testResults)
      if (reports) caseItem.reports.push(...reports)
      await caseItem.save()
      res.json(caseItem)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async deleteCase(req, res) {
    try {
      const caseItem = await Case.findById(req.params.id)
      if (!caseItem) {
        return res.status(404).json({ error: "Case not found" })
      }
      await Case.deleteOne({ _id: req.params.id })
      res.json({ message: "Case deleted successfully" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async assignCase(req, res) {
    try {
      const { userId } = req.body
      await caseAssignmentService.assignCase(req.params.id, userId)
      res.json({ message: "Case assigned successfully" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async addResponse(req, res) {
    try {
      const { content } = req.body
      const caseItem = await Case.findById(req.params.id)
      if (!caseItem) {
        return res.status(404).json({ error: "Case not found" })
      }
      if (!(await caseAssignmentService.canAccessCase(req.user.id, caseItem._id))) {
        return res.status(403).json({ error: "Access denied" })
      }
      caseItem.responses.push({ user: req.user.id, content })
      await caseItem.save()
      res.json({ message: "Response added successfully" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },
}

module.exports = caseController

