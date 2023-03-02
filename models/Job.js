const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please enter a company"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Please enter a title"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "applied", "interview", "offer", "rejected"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
