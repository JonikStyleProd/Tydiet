import mongoose from "mongoose";

const DaySchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Day = mongoose.model("Day", DaySchema);
const DietSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  instructor: { type: mongoose.Schema.ObjectId, ref: "User" },
  published: {
    type: Boolean,
    default: false,
  },
  days: [DaySchema],
});

export default mongoose.model("Diet", DietSchema);
