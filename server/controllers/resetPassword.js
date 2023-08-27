const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

exports.resetPasswordToken = async (req, res) => {
  try {
    // 1- fetch data
    const email = req.body.email
    const user = await User.findOne({ email: email })

    // 2- validate 
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      })
    }

    // 3- generate token
    // const token = crypto.randomUUID();
    const token = crypto.randomBytes(20).toString("hex")

    // 4- insert token and expiry time in user object in db
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    )
    console.log("DETAILS", updatedDetails)
    
    // 5- create frontend Url link ( to be sent with the email to the user )
    const url = `http://localhost:3000/update-password/${token}`
    // const url = `https://studynotion-edtech-project.vercel.app/update-password/${token}`

    // 6- send email containing the frontend Url link to reset password
    await mailSender(
      email,
      "Password Reset",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    )
    res.json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
    })
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    // 1- fetch data
    const { password, confirmPassword, token } = req.body

    // 2- validate
    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      })
    }

    // 3- extract user from DB using TOKEN
    const userDetails = await User.findOne({ token: token })
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      })
    }

    // 4- validate exipiration time of TOKEN
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      })
    }

    // 5- hash the new password 
    const encryptedPassword = await bcrypt.hash(password, 10)

    // 6- update password in DB
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true } // return new document 
    )
    res.json({
      success: true,
      message: `Password Reset Successful`,
    })
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    })
  }
}
