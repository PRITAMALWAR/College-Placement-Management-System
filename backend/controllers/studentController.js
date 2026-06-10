import Student from "../models/Student.js";
import User from "../models/User.js";


// @desc Get Student Profile
// @route GET /api/student/profile
// @access Private (Student)
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      userId: req.user._id,
    }).populate(
      "userId",
      "name email role"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Update Student Profile
// @route PUT /api/student/profile
// @access Private (Student)
export const updateStudentProfile = async (
  req,
  res
) => {
  try {
    const {
      name,
      branch,
      cgpa,
      skills,
      enrollmentNo,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    const student = await Student.findOne({
      userId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (name) {
      user.name = name;
      await user.save();
    }

    student.branch =
      branch || student.branch;

    student.cgpa =
      cgpa || student.cgpa;

    student.skills =
      skills || student.skills;

    student.enrollmentNo =
      enrollmentNo ||
      student.enrollmentNo;

    await student.save();

    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Upload Resume
// @route POST /api/student/upload-resume
// @access Private (Student)
export const uploadResume = async (
  req,
  res
) => {
  try {
    const student = await Student.findOne({
      userId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    student.resume = req.file.path;

    await student.save();

    res.status(200).json({
      success: true,
      message:
        "Resume uploaded successfully",
      resume: student.resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};