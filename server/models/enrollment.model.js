import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
  diet: { type: mongoose.Schema.ObjectId, ref: "Diet" },
  updated: Date,
  enrolled: {
    type: Date,
    default: Date.now,
  },
  dietUser: { type: mongoose.Schema.ObjectId, ref: "User" },
  dayStatus: [
    {
      day: { type: mongoose.Schema.ObjectId, ref: "Day" },
      complete: Boolean,
    },
  ],
  completed: Date,
});

export default mongoose.model("Enrollment", EnrollmentSchema);
