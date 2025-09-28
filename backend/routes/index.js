const express = require("express");
const userRouter = require("./user_fixed");
const coursesRouter = require("./courses");
const enrollmentsRouter = require("./enrollments");
const gradesRouter = require("./grades");
const attendanceRouter = require("./attendance");
const adminRouter = require("./admin");
const publicRouter = require("./public");

const router = express.Router();

router.use("/user", userRouter);
router.use("/courses", coursesRouter);
router.use("/enrollments", enrollmentsRouter);
router.use("/grades", gradesRouter);
router.use("/attendance", attendanceRouter);
router.use("/admin", adminRouter);
router.use("/public", publicRouter);

module.exports = router;