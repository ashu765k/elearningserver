// import express from "express";
// import { isAdmin, isAuth } from "../middlewares/isAuth.js";
// import {
//     addLectures,
//     createCourse,
//     deleteCourse,
//     deleteLecture,
//     getAllStats,
//     getAllUser,
//     updateRole
// } from "../controllers/admin.js";
// import { uploadFiles } from "../middlewares/multer.js";

// const router = express.Router();

// router.post("/course/new", isAuth, isAdmin, uploadFiles, createCourse);
// router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLectures);
// router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
// router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
// router.get("/stats", isAuth, isAdmin, getAllStats);
// router.put("/user/:id", isAuth, updateRole);
// router.get("/users", isAuth, isAdmin, getAllUser);

// export default router;
// routes/admin.js
import express from "express";
import {
  createCourse,
  addLectures,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole,
  // getUserAssessment,
  // getAdminAssessment,
  // addAssessmentQuestion,
  // deleteAssessmentQuestion,
  // submitAssessment
} from "../controllers/admin.js";

import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { uploadFiles } from "../middlewares/multer.js";

const router = express.Router();

// Course management
router.post("/course/new", isAuth, isAdmin, uploadFiles, createCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLectures);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);

// Admin utilities
router.get("/stats", isAuth, isAdmin, getAllStats);
router.put("/user/:id", isAuth, updateRole);
router.get("/users", isAuth, isAdmin, getAllUser);

// // Assessment routes
// router.get("/assessment/:courseId", isAuth, getUserAssessment);
// router.get("/assessment/admin/:courseId", isAuth, isAdmin, getAdminAssessment);
// router.post("/assessment/:courseId", isAuth, isAdmin, addAssessmentQuestion);
// router.delete("/assessment/question/:id", isAuth, isAdmin, deleteAssessmentQuestion);
// router.post("/assessment/submit/:courseId", isAuth, submitAssessment);

export default router;
