const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active"],
      default: "pending",
    },
    confirmationToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    confirmationTokenExpires: {
      type: Date,
    },
    assignedCases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case",
      },
    ],
  },
  { timestamps: true },
)

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)

