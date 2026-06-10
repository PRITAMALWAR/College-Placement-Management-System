import mongoose from "mongoose";

const placementDriveSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    package: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    eligibleBranches: [
      {
        type: String,
        trim: true,
      },
    ],

    minimumCGPA: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

const PlacementDrive = mongoose.model(
  "PlacementDrive",
  placementDriveSchema
);

export default PlacementDrive;