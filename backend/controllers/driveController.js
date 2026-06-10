import Company from "../models/Company.js";
import PlacementDrive from "../models/PlacementDrive.js";


// Create Drive
export const createDrive = async (req, res) => {
  try {
    const {
      title,
      description,
      package: packageAmount,
      location,
      eligibleBranches,
      minimumCGPA,
      requiredSkills,
      deadline,
    } = req.body;

    const company = await Company.findOne({
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const drive = await PlacementDrive.create({
      companyId: company._id,
      title,
      description,
      package: packageAmount,
      location,
      eligibleBranches,
      minimumCGPA,
      requiredSkills,
      deadline,
    });

    res.status(201).json({
      success: true,
      drive,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Drives
export const getAllDrives = async (
  req,
  res
) => {
  try {
    const drives =
      await PlacementDrive.find()
        .populate(
          "companyId",
          "companyName website"
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


// Get Single Drive
export const getDriveById = async (
  req,
  res
) => {
  try {
    const drive =
      await PlacementDrive.findById(
        req.params.id
      ).populate(
        "companyId",
        "companyName website description"
      );

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found",
      });
    }

    res.status(200).json({
      success: true,
      drive,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update Drive
export const updateDrive = async (
  req,
  res
) => {
  try {
    const drive =
      await PlacementDrive.findById(
        req.params.id
      );

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found",
      });
    }

    const company =
      await Company.findOne({
        userId: req.user._id,
      });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (
      drive.companyId.toString() !==
      company._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Not authorized to update this drive",
      });
    }

    const updatedDrive =
      await PlacementDrive.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      drive: updatedDrive,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Drive
export const deleteDrive = async (
  req,
  res
) => {
  try {
    const drive =
      await PlacementDrive.findById(
        req.params.id
      );

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found",
      });
    }

    const company =
      await Company.findOne({
        userId: req.user._id,
      });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (
      drive.companyId.toString() !==
      company._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Not authorized to delete this drive",
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
      message: error.message,
    });
  }
};


// Company Drives
export const getMyDrives = async (
  req,
  res
) => {
  try {
    const company =
      await Company.findOne({
        userId: req.user._id,
      });

    if (!company) {
      return res.status(404).json({
        success: false,
        message:
          "Company profile not found",
      });
    }

    const drives =
      await PlacementDrive.find({
        companyId: company._id,
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