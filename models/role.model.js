const mongoose = require("mongoose")

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["superAdmin", "analyst", "investigator", "labExpert"],
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  permissions: [String],
})

module.exports = mongoose.model("Role", RoleSchema)

