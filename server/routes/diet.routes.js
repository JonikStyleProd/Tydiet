import express from "express";
import dietCtrl from "../controllers/diet.controller";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";

const router = express.Router();

router.route("/api/diets/published").get(dietCtrl.listPublished);

router
  .route("/api/diets/by/:userId")
  .post(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.isCreator,
    dietCtrl.create
  )
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    dietCtrl.listByInstructor
  );

router
  .route("/api/diets/photo/:dietId")
  .get(dietCtrl.photo, dietCtrl.defaultPhoto);

  router.route("/api/diets/latest").get(dietCtrl.listLatest);
router.route("/api/diets/categories").get(dietCtrl.listCategories);
router.route("/api/diets").get(dietCtrl.listSearch);

router.route("/api/diets/defaultphoto").get(dietCtrl.defaultPhoto);

router
  .route("/api/diets/:dietId/day/new")
  .put(authCtrl.requireSignin, dietCtrl.isInstructor, dietCtrl.newDay);

router
  .route("/api/diets/:dietId")
  .get(dietCtrl.read)
  .put(authCtrl.requireSignin, dietCtrl.isInstructor, dietCtrl.update)
  .delete(authCtrl.requireSignin, dietCtrl.isInstructor, dietCtrl.remove);




router.param("dietId", dietCtrl.dietByID);
router.param("userId", userCtrl.userByID);

export default router;
