// Import the Mongoose library
const mongoose = require("mongoose")

// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },

    // password field 
    password: {
      type: String,
      required: true,
    },
    // role field and enum values of "Admin", "Student", or "Visitor"
    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor"],
      required: true,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseProgress",
      },
    ],

    //Course image , type = string becuase it is URL
    image: {
      type: String,
    },
    
    // Additional Details for My Profile page
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile",
    },

    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },


    // To Reset Password
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },


  // Add timestamps for when the document is created and last modified
  },

  { timestamps: true }

)

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("User", userSchema)
