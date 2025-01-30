const mongoose = require("mongoose")

const caseSchema = new mongoose.Schema(
  {
    athleteName: { type: String, required: true },
    sport: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "closed"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    responses: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    testResults: [{ type: String }],
    reports: [{ type: String }],
  },
  { timestamps: true },
)

module.exports = mongoose.model("Case", caseSchema)

