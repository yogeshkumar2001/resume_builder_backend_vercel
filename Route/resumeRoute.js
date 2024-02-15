const { saveResume, getResumeById, deleteResumeByid } = require('../Controller');

const resumeRouter = require('express').Router();

resumeRouter.route("/save").post(saveResume)
resumeRouter.route("/").get(getResumeById)
resumeRouter.route("/delete/:id").delete(deleteResumeByid)

module.exports.resumeRouter = resumeRouter;   