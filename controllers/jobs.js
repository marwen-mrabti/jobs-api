const { StatusCodes } = require("http-status-codes");
const { CustomAPIError, NotFoundError, BadRequestError } = require("../errors");
const Job = require("../models/job");

//create job
/**
 * @description create a new job
 * @route POST /api/v1/jobs/new
 * @access private
 * @param {*} req
 * @param {*} res
 */
const createJob = async (req, res) => {
  try {
    const { userId } = req.user;
    const { company, position } = req.body;
    const job = await Job.create({ company, position, createdBy: userId });
    res.status(StatusCodes.CREATED).json(job);
  } catch (error) {
    throw new CustomAPIError(error.message, 500);
  }
};

/**
 * @description get all jobs created by the user
 * @route GET /api/v1/jobs
 * @access private
 * @param {*} req
 * @param {*} res
 */
const getAllJobs = async (req, res) => {
  try {
    const { userId } = req.user;
    const jobs = await Job.find({ createdBy: userId }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json(jobs);
  } catch (error) {
    throw new CustomAPIError(error.message, 500);
  }
};

/**
 * @description get a single job
 * @route GET /api/v1/jobs/:id
 * @access private
 * @param {*} req
 * @param {*} res
 */
const getJobById = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const job = await Job.findOne({ _id: id, createdBy: userId });
  if (!job) throw new NotFoundError("Job not found");

  res.status(StatusCodes.OK).json(job);
};

//update job
const updateJob = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { company, position } = req.body;
    if (company === "" || position === "")
      throw new BadRequestError("Please provide company and position");

    const job = await Job.findOneAndUpdate(
      { _id: id, createdBy: userId },
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!job) throw new NotFoundError("Job not found");
    res.status(StatusCodes.OK).json(job);
  } catch (error) {
    throw new CustomAPIError(error.message, 500);
  }
};

//delete job
const deleteJob = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const job = await Job.findOneAndDelete({ _id: id, createdBy: userId });
    if (!job) throw new NotFoundError("Job not found");
    res.status(StatusCodes.OK).json({ msg: "Job deleted successfully" });
  } catch (error) {
    throw new CustomAPIError(error.message, 500);
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
