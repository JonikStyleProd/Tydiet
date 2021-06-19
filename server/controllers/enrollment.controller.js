import Enrollment from "../models/enrollment.model";
import errorHandler from "./../helpers/dbErrorHandler";

const create = async (req, res) => {
  let newEnrollment = {
    diet: req.diet,
    dietUser: req.auth,
  };
  newEnrollment.dayStatus = req.diet.days.map((day) => {
    return { day: day, complete: false };
  });
  const enrollment = new Enrollment(newEnrollment);
  try {
    let result = await enrollment.save();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

/**
 * Load enrollment and append to req.
 */
const enrollmentByID = async (req, res, next, id) => {
  try {
    let enrollment = await Enrollment.findById(id)
      .populate({ path: "diet", populate: { path: "instructor" } })
      .populate("dietUser", "_id name");
    if (!enrollment)
      return res.status("400").json({
        error: "Enrollment not found",
      });
    req.enrollment = enrollment;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve enrollment",
    });
  }
};

const read = (req, res) => {
  return res.json(req.enrollment);
};

const complete = async (req, res) => {
  let updatedData = {};
  updatedData["dayStatus.$.complete"] = req.body.complete;
  updatedData.updated = Date.now();
  if (req.body.dietCompleted)
    updatedData.completed = req.body.dietCompleted;

  try {
    let enrollment = await Enrollment.updateOne(
      { "dayStatus._id": req.body.dayStatusId },
      { $set: updatedData }
    );
    res.json(enrollment);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let enrollment = req.enrollment;
    let deletedEnrollment = await enrollment.remove();
    res.json(deletedEnrollment);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isStudent = (req, res, next) => {
  const isStudent = req.auth && req.auth._id == req.enrollment.dietUser._id;
  if (!isStudent) {
    return res.status("403").json({
      error: "User is not enrolled",
    });
  }
  next();
};

const listEnrolled = async (req, res) => {
  try {
    let enrollments = await Enrollment.find({ dietUser: req.auth._id })
      .sort({ completed: 1 })
      .populate("diet", "_id name category");
    res.json(enrollments);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const findEnrollment = async (req, res, next) => {
  try {
    let enrollments = await Enrollment.find({
      diet: req.diet._id,
      dietUser: req.auth._id,
    });
    if (enrollments.length == 0) {
      next();
    } else {
      res.json(enrollments[0]);
    }
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const enrollmentStats = async (req, res) => {
  try {
    let stats = {};
    stats.totalEnrolled = await Enrollment.find({
      diet: req.diet._id,
    }).countDocuments();
    stats.totalCompleted = await Enrollment.find({ diet: req.diet._id })
      .exists("completed", true)
      .countDocuments();
    res.json(stats);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  enrollmentByID,
  read,
  remove,
  complete,
  isStudent,
  listEnrolled,
  findEnrollment,
  enrollmentStats,
};
