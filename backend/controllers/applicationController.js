import Application from "../models/Application.js";
import PlacementDrive from "../models/PlacementDrive.js";
import Student from "../models/Student.js";
import Company from "../models/Company.js";
import eligibilityChecker from "../utils/eligibilityChecker.js";

export const applyForDrive = async (
  req,
  res
) => {
  try {
    const { driveId } = req.body;

    const student = await Student.findOne({
      userId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const drive =
      await PlacementDrive.findById(
        driveId
      );

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Placement drive not found",
      });
    }

    if (drive.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "Drive is closed",
      });
    }

    const existingApplication =
      await Application.findOne({
        studentId: student._id,
        driveId,
      });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message:
          "You have already applied for this drive",
      });
    }

    const eligibility =
      eligibilityChecker(
        student,
        drive
      );

    if (!eligibility.eligible) {
      return res.status(400).json({
        success: false,
        message: eligibility.reason,
      });
    }

    const application =
      await Application.create({
        studentId: student._id,
        driveId,
      });

    res.status(201).json({
      success: true,
      message:
        "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const getMyApplications = async (
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

    const applications =
      await Application.find({
        studentId: student._id,
      })
        .populate({
          path: "driveId",
          populate: {
            path: "companyId",
            select:
              "companyName website",
          },
        })
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getDriveApplications = async (
  req,
  res
) => {
  try {
    const { driveId } = req.params;

    const company = await Company.findOne({
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const drive =
      await PlacementDrive.findById(driveId);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found",
      });
    }

    if (
      drive.companyId.toString() !==
      company._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const applications =
      await Application.find({
        driveId,
      })
        .populate({
          path: "studentId",
          populate: {
            path: "userId",
            select: "name email",
          },
        })
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const updateApplicationStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      const application =
        await Application.findById(
          req.params.id
        );

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      application.status = status;

      await application.save();

      res.status(200).json({
        success: true,
        message:
          "Application status updated",
        application,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };