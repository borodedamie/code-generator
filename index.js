import express from "express";
import nodemailer from "nodemailer";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

function generateCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

function getCurrentDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(2);
  return `${day}/${month}/${year}`;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function sendCode() {
  const code = generateCode();
  const currentDate = getCurrentDate();
  const mailOptions = {
    from: `Access Code <>`,
    to: "itedoestate506@gmail.com",
    subject: "ACCESS CODE",
    text: `SPECIAL ANNOUNCEMENT! NEW CODE

        Dear all

        This platform was created to inform you all about happenings in itedo estate.

        TODAY'S PASSCODE: ${code}

        Kindly show the code at the gate for confirmation when you are coming into the estate. thank you

        Signed by Exco

        ${currentDate}`,
  };

  transporter.sendMail(mailOptions, (error, _info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log(`Code email sent successfully`);
    }
  });
}

cron.schedule("0 0,6 * * *", () => {
  sendCode();
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
