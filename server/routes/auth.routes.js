import express from "express";
import authCtrl from "../controllers/auth.controller";

const router = express.Router();

router.route("/auth/signin").post(authCtrl.signin);
router.route("/auth/signout").get(authCtrl.signout);

export default router;

{
  /* 
    /auth/signin: POST request to authenticate the 	user with their email and password

    /auth/signout: GET reques to cleat the cookie containing a JWT that was set on the response object afyer sing-in

*/
}
