const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
  try {
    // create transporter / postman / deleveryboy
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    //   secure: false,
    })

    // send mail using sendmail() method on nademailer
    let info = await transporter.sendMail({
      from: `"SkillNation | Intakhab" <${process.env.MAIL_USER}>`, // sender's email address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    })
    console.log(info.response)
    return info

  } catch (error) {
    console.log(error.message)
    return error.message
  }
}

module.exports = mailSender
