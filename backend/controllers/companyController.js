import Company from "../models/Company.js";
import User from "../models/User.js";


// @desc Create Company Profile
// @route POST /api/company/profile
// @access Private (Company)
export const createCompanyProfile = async (
  req,
  res
) => {
  try {
    const {
      companyName,
      website,
      description,
      hrName,
      hrEmail,
    } = req.body;

    const existingCompany =
      await Company.findOne({
        userId: req.user._id,
      });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message:
          "Company profile already exists",
      });
    }

    const company = await Company.create({
      userId: req.user._id,
      companyName,
      website,
      description,
      hrName,
      hrEmail,
    });

    res.status(201).json({
      success: true,
      message:
        "Company profile created successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Get Company Profile
// @route GET /api/company/profile
// @access Private (Company)
export const getCompanyProfile = async (
  req,
  res
) => {
  try {
    const company = await Company.findOne({
      userId: req.user._id,
    }).populate(
      "userId",
      "name email role"
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message:
          "Company profile not found",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Update Company Profile
// @route PUT /api/company/profile
// @access Private (Company)
export const updateCompanyProfile =
  async (req, res) => {
    try {
      const {
        name,
        companyName,
        website,
        description,
        hrName,
        hrEmail,
      } = req.body;

      const user = await User.findById(
        req.user._id
      );

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

      if (name) {
        user.name = name;
        await user.save();
      }

      company.companyName =
        companyName ||
        company.companyName;

      company.website =
        website || company.website;

      company.description =
        description ||
        company.description;

      company.hrName =
        hrName || company.hrName;

      company.hrEmail =
        hrEmail || company.hrEmail;

      await company.save();

      res.status(200).json({
        success: true,
        message:
          "Company profile updated successfully",
        company,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };