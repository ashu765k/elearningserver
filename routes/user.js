// import express from "express";
// import {
//   loginUser,
//   myProfile,
//   register,
//   verifyUser,
// } from "../controllers/user.js";
// import { isAuth } from "../middlewares/isAuth.js";
// import { addProgress, getYourProgress } from "../controllers/course.js";

// const router = express.Router();

// router.post('/me', (req, res) => {
//   res.json({ message: 'Please Login' });
// });
// router.post("/user/register", register);
// router.post("/user/verify", verifyUser);
// router.post("/user/login", loginUser);
// router.get("/user/me", isAuth, myProfile);
// router.post("/user/progress", isAuth, addProgress);
// router.get("/user/progress", isAuth, getYourProgress);

// export default router;

import express from "express";
import {
  forgotPassword,
  resetPassword,
  loginUser,
  myProfile,
  register,
  verifyUser,
} from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";
import { addProgress, getYourProgress } from "../controllers/course.js";
// import {
//   getAssessmentQuestions,
//   submitAssessment
// } from "../controllers/user.js";

const router = express.Router();

router.post('/me', (req, res) => {
  res.json({ message: 'Please Login' });
});
router.post("/user/register", register);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/me", isAuth, myProfile);
router.post("/user/forgot",forgotPassword)
router.post("/user/reset",resetPassword)
router.post("/user/progress", isAuth, addProgress);
router.get("/user/progress", isAuth, getYourProgress);

// Assessment routes for users
// router.get("/user/assessment/:courseId", isAuth, getAssessmentQuestions);
// router.post("/user/assessment/submit/:courseId", isAuth, submitAssessment);

export default router;
