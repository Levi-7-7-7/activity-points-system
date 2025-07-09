const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Activity Points System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email - OTP',
    html: `<h3>Your OTP is <b>${otp}</b></h3><p>This OTP is valid for 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
