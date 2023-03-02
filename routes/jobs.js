const express = require("express");
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");
const { isAuth } = require("../middleware/authentication");
const router = express.Router();

// routes
router.route("/").get(getAllJobs);
router.route("/new").post(createJob);
router.route("/:id").get(getJobById);
router.route("/:id").patch(updateJob);
router.route("/:id").delete(deleteJob);

module.exports = router;
