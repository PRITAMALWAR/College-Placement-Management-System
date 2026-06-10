import User from "../models/User.js";
import Student from "../models/Student.js";
import generateToken from "../utils/generateToken.js";


// @desc Register Student
// @route POST /api/auth/register
// @access Public
// export const registerStudent = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       enrollmentNo,
//       branch,
//       cgpa,
//       skills,
//     } = req.body;

//     const existingUser = await User.findOne({
//       email,
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: "student",
//     });

//     await Student.create({
//       userId: user._id,
//       enrollmentNo,
//       branch,
//       cgpa,
//       skills,
//     });

//     const token = generateToken(
//       user._id,
//       user.role
//     );

//     res.status(201).json({
//       success: true,
//       message: "Student registered successfully",
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      enrollmentNo,
      branch,
      cgpa,
      skills,
    } = req.body;

    console.log("Step 1");

    const existingUser = await User.findOne({
      email,
    });

    console.log("Step 2");

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "student",
    });

    console.log("Step 3");

    await Student.create({
      userId: user._id,
      enrollmentNo,
      branch,
      cgpa,
      skills,
    });

    console.log("Step 4");

    const token = generateToken(
      user._id,
      user.role
    );

    console.log("Step 5");

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      token,
    });

  } catch (error) {

    console.error("REGISTER ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

// @desc Login User
// @route POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google Sign-In",
      });
    }

    const isMatch =
      await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(
      user._id,
      user.role
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Get Current User
// @route GET /api/auth/me
// @access Private
export const getCurrentUser = async (
  req,
  res
) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Google Login Success
// @route GET /api/auth/google/success
export const googleSuccess = async (
  req,
  res
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Google login failed",
      });
    }

    const token = generateToken(
      req.user._id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Logout
// @route GET /api/auth/logout
export const logoutUser = async (
  req,
  res
) => {
  req.logout(() => {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
};