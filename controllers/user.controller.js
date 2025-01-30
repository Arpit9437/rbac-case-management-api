const User = require("../models/user.model")
const Role = require("../models/role.model")
const crypto = require("crypto")
const transporter = require("../config/emailConfig")
const { generateConfirmationEmail } = require("../utils/emailTemplate")

const userController = {
  async createUser(req, res) {
    try {
      const { username, email, roleName } = req.body

      const role = await Role.findOne({ name: roleName })
      if (!role) {
        return res.status(400).json({ error: "Invalid role" })
      }

      const confirmationToken = crypto.randomBytes(32).toString("hex")
      const confirmationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

      const password = crypto.randomBytes(12).toString("hex")

      const user = new User({
        username,
        email,
        password,
        role: role._id,
        status: "pending",
        confirmationToken,
        confirmationTokenExpires,
      })

      await user.save()

      const emailContent = generateConfirmationEmail(username, confirmationToken)

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      })

      res.status(201).json({
        message: "User created successfully",
        user: {
          username: user.username,
          email: user.email,
          role: role.name,
          status: user.status,
        },
      })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async confirmAccount(req, res) {
    try {
      const { token } = req.params

      const user = await User.findOne({
        confirmationToken: token,
        confirmationTokenExpires: { $gt: Date.now() },
        status: "pending",
      })

      if (!user) {
        return res.status(400).json({
          error: "Invalid or expired confirmation token",
        })
      }

      user.status = "active"
      user.confirmationToken = undefined
      user.confirmationTokenExpires = undefined
      await user.save()

      res.json({
        message: "Account confirmed successfully",
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await User.find().select("-password").populate("role", "name")
      res.json(users)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

module.exports = userController

