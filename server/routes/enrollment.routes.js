import express from "express";
import enrollmentCtrl from "../controllers/enrollment.controller";
import dietCtrl from "../controllers/diet.controller";
import authCtrl from "../controllers/auth.controller";

const router = express.Router();

router
  .route("/api/enrollment/enrolled")
  .get(authCtrl.requireSignin, enrollmentCtrl.listEnrolled);

router
  .route("/api/enrollment/new/:dietId")
  .post(
    authCtrl.requireSignin,
    enrollmentCtrl.findEnrollment,
    enrollmentCtrl.create
  );

router
  .route("/api/enrollment/stats/:dietId")
  .get(enrollmentCtrl.enrollmentStats);

router
  .route("/api/enrollment/complete/:enrollmentId")
  .put(
    authCtrl.requireSignin,
    enrollmentCtrl.isStudent,
    enrollmentCtrl.complete
  );

router
  .route("/api/enrollment/:enrollmentId")
  .get(authCtrl.requireSignin, enrollmentCtrl.isStudent, enrollmentCtrl.read)
  .delete(
    authCtrl.requireSignin,
    enrollmentCtrl.isStudent,
    enrollmentCtrl.remove
  );

router.param("dietId", dietCtrl.dietByID);
router.param("enrollmentId", enrollmentCtrl.enrollmentByID);

export default router;
