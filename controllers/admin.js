import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/User.js";

import express from 'express';
const router = express.Router();

export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration, price } = req.body;

  const image = req.file;

  await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: image?.path,
    duration,
    price,
  });

  res.status(201).json({
    message: "Course Created Successfully",
  });
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course)
    return res.status(404).json({
      message: "No Course with this id",
    });

  const { title, description } = req.body;

  const file = req.file;

  const lecture = await Lecture.create({
    title,
    description,
    video: file?.path,
    course: course._id,
  });

  res.status(201).json({
    message: "Lecture Added",
    lecture,
  });
});
export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  rm(lecture.video, () => {
    console.log("Video deleted");
  });

  await lecture.deleteOne();

  res.json({ message: "Lecture Deleted" });
});

const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  const lectures = await Lecture.find({ course: course._id });

  await Promise.all(
    lectures.map(async (lecture) => {
      await unlinkAsync(lecture.video);
      console.log("video deleted");
    })
  );

  rm(course.image, () => {
    console.log("image deleted");
  });

  await Lecture.find({ course: req.params.id }).deleteMany();

  await course.deleteOne();

  await User.updateMany({}, { $pull: { subscription: req.params.id } });

  res.json({
    message: "Course Deleted",
  });
});

export const getAllStats = TryCatch(async (req, res) => {
  const totalCoures = (await Courses.find()).length;
  const totalLectures = (await Lecture.find()).length;
  const totalUsers = (await User.find()).length;

  const stats = {
    totalCoures,
    totalLectures,
    totalUsers,
  };

  res.json({
    stats,
  });
});

export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.json({ users });
});

export const updateRole = TryCatch(async (req, res) => {
  if (req.user.mainrole !== "superadmin")
    return res.status(403).json({
      message: "This endpoint is assign to superadmin",
    });
  const user = await User.findById(req.params.id);

  if (user.role === "user") {
    user.role = "admin";
    await user.save();

    return res.status(200).json({
      message: "Role updated to admin",
    });
  }

  if (user.role === "admin") {
    user.role = "user";
    await user.save();

    return res.status(200).json({
      message: "Role updated to Admin",
    });
  }
});

// These are the endpoints you need to implement in your backend

// controllers/admin.js
// import TryCatch from "../middlewares/TryCatch.js";
// import { Courses } from "../models/Courses.js";
// import { Lecture } from "../models/Lecture.js";
// import { User } from "../models/User.js";
// import { Assessment } from "../models/Assessment.js";
// import { AssessmentResult } from "../models/AssessmentResult.js";
// import { promisify } from "util";
// import fs, { rm } from "fs";

// const unlinkAsync = promisify(fs.unlink);

// // --- CONTROLLERS START ---

// export const createCourse = TryCatch(async (req, res) => {
//   const { title, description, category, createdBy, duration, price } = req.body;
//   const image = req.file;

//   await Courses.create({
//     title,
//     description,
//     category,
//     createdBy,
//     image: image?.path,
//     duration,
//     price,
//   });

//   res.status(201).json({ message: "Course Created Successfully" });
// });

// export const addLectures = TryCatch(async (req, res) => {
//   const course = await Courses.findById(req.params.id);
//   if (!course) return res.status(404).json({ message: "No Course with this id" });

//   const { title, description } = req.body;
//   const file = req.file;

//   const lecture = await Lecture.create({
//     title,
//     description,
//     video: file?.path,
//     course: course._id,
//   });

//   res.status(201).json({ message: "Lecture Added", lecture });
// });

// export const deleteLecture = TryCatch(async (req, res) => {
//   const lecture = await Lecture.findById(req.params.id);
//   rm(lecture.video, () => console.log("Video deleted"));
//   await lecture.deleteOne();
//   res.json({ message: "Lecture Deleted" });
// });

// export const deleteCourse = TryCatch(async (req, res) => {
//   const course = await Courses.findById(req.params.id);
//   const lectures = await Lecture.find({ course: course._id });

//   await Promise.all(lectures.map(lecture => unlinkAsync(lecture.video)));
//   rm(course.image, () => console.log("Image deleted"));

//   await Lecture.deleteMany({ course: req.params.id });
//   await course.deleteOne();
//   await User.updateMany({}, { $pull: { subscription: req.params.id } });

//   res.json({ message: "Course Deleted" });
// });

// export const getAllStats = TryCatch(async (req, res) => {
//   const totalCoures = (await Courses.find()).length;
//   const totalLectures = (await Lecture.find()).length;
//   const totalUsers = (await User.find()).length;

//   res.json({ stats: { totalCoures, totalLectures, totalUsers } });
// });

// export const getAllUser = TryCatch(async (req, res) => {
//   const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
//   res.json({ users });
// });

// export const updateRole = TryCatch(async (req, res) => {
//   if (req.user.mainrole !== "superadmin")
//     return res.status(403).json({ message: "This endpoint is assign to superadmin" });

//   const user = await User.findById(req.params.id);

//   user.role = user.role === "user" ? "admin" : "user";
//   await user.save();

//   res.status(200).json({ message: `Role updated to ${user.role}` });
// });

// // --- ASSESSMENT CONTROLLERS ---

// export const getUserAssessment = TryCatch(async (req, res) => {
//   const courseId = req.params.courseId;
//   const questions = await Assessment.find({ course: courseId }).select('-options.isCorrect');
//   res.status(200).json({ success: true, questions });
// });

// export const getAdminAssessment = TryCatch(async (req, res) => {
//   const courseId = req.params.courseId;
//   const questions = await Assessment.find({ course: courseId });
//   res.status(200).json({ success: true, questions });
// });

// // export const addAssessmentQuestion = TryCatch(async (req, res) => {
// //   const courseId = req.params.courseId;
// //   const { question, options } = req.body;

// //   const newQuestion = await Assessment.create({
// //     course: courseId,
// //     text: question,
// //     options,
// //   });

// //   res.status(201).json({ success: true, message: 'Question added successfully', question: newQuestion });
// // });
// // Example controller for adding a question to a course

// export const addAssessmentQuestion = TryCatch(async (req, res) => {
//   const courseId = req.params.id;
//   const { question, options } = req.body;

//   if (!courseId) {
//     return res.status(400).json({ success: false, message: "Course ID is required" });
//   }

//   if (!question || !options || options.length !== 4) {
//     return res.status(400).json({ success: false, message: "Invalid question or options" });
//   }

//   const newQuestion = new Assessment({
//     course: courseId,
//     text: question,
//     options,
//   });

//   await newQuestion.save();

//   res.status(201).json({
//     success: true,
//     message: "Question added",
//     question: newQuestion,
//   });
// });


// export const deleteAssessmentQuestion = TryCatch(async (req, res) => {
//   const questionId = req.params.id;
//   await Assessment.findByIdAndDelete(questionId);
//   res.status(200).json({ success: true, message: 'Question deleted successfully' });
// });

// export const submitAssessment = TryCatch(async (req, res) => {
//   const courseId = req.params.courseId;
//   const { answers } = req.body;
//   const userId = req.user._id;

//   const questions = await Assessment.find({ course: courseId });

//   let correctAnswers = 0;
//   const totalQuestions = questions.length;

//   questions.forEach(question => {
//     const userAnswerId = answers[question._id];
//     const selectedOption = question.options.find(opt => opt._id.toString() === userAnswerId);
//     if (selectedOption?.isCorrect) correctAnswers++;
//   });

//   const percentage = (correctAnswers / totalQuestions) * 100;
//   const passed = percentage >= 70;

//   await AssessmentResult.create({
//     user: userId,
//     course: courseId,
//     score: percentage,
//     correctAnswers,
//     totalQuestions,
//     passed,
//     answers,
//   });

//   res.status(200).json({
//     success: true,
//     result: {
//       correctAnswers,
//       totalQuestions,
//       percentage: Math.round(percentage),
//       passed,
//     }
//   });
// });
