import Student from "../models/Student.js";
import Company from "../models/Company.js";
import PlacementDrive from "../models/PlacementDrive.js";
import Application from "../models/Application.js";


// @desc Dashboard Statistics
// @route GET /api/admin/dashboard
// @access Private (Admin)
export const dashboardStats = async (
  req,
  res
) => {
  try {
    const totalStudents =
      await Student.countDocuments();

    const totalCompanies =
      await Company.countDocuments();

    const totalDrives =
      await PlacementDrive.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    const placedStudents =
      await Student.countDocuments({
        placed: true,
      });

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalCompanies,
        totalDrives,
        totalApplications,
        placedStudents,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Get All Students
// @route GET /api/admin/students
// @access Private (Admin)
export const getAllStudents = async (
  req,
  res
) => {
  try {
    const students = await Student.find()
      .populate(
        "userId",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Get All Companies
// @route GET /api/admin/companies
// @access Private (Admin)
export const getAllCompanies = async (
  req,
  res
) => {
  try {
    const companies =
      await Company.find()
        .populate(
          "userId",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// @desc Get All Placement Drives
// @route GET /api/admin/drives
// @access Private (Admin)
export const getAllDrives = async (
  req,
  res
) => {
  try {
    const drives =
      await PlacementDrive.find()
        .populate(
          "companyId",
          "companyName"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: drives.length,
      drives,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Get All Applications
// @route GET /api/admin/applications
// @access Private (Admin)
export const getAllApplications =
  async (req, res) => {
    try {
      const applications =
        await Application.find()
          .populate({
            path: "studentId",
            populate: {
              path: "userId",
              select:
                "name email",
            },
          })
          .populate({
            path: "driveId",
            select:
              "title package",
          })
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count:
          applications.length,
        applications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


  // @desc Update Placement Status
// @route PATCH /api/admin/students/:id/placement-status
// @access Private (Admin)
export const updateStudentPlacementStatus =
  async (req, res) => {
    try {
      const { placed } =
        req.body;

      const student =
        await Student.findById(
          req.params.id
        );

      if (!student) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Student not found",
          });
      }

      student.placed =
        placed;

      await student.save();

      res.status(200).json({
        success: true,
        message:
          "Placement status updated successfully",
        student,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

  // @desc Delete Drive
// @route DELETE /api/admin/drives/:id
// @access Private (Admin)
export const deleteDriveByAdmin =
  async (req, res) => {
    try {
      const drive =
        await PlacementDrive.findById(
          req.params.id
        );

      if (!drive) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Drive not found",
          });
      }

      await drive.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Drive deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };