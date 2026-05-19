import nodemailer from "nodemailer"
import logger from "./logger.js"

// Configure nodemailer with environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'OVS Admin'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    })
    logger.info(`Message sent: ${info.messageId}`)
    return info
  } catch (error) {
    logger.error("Error sending email:", error)
    throw new Error("Could not send email")
  }
}
