//https://www.w3schools.com/nodejs/nodejs_email.asp

// backend/src/utils/mailer.js
const nodemailer = require("nodemailer");

let transporterPromise = null;

async function getTransporter() {
  // Αν έχεις SMTP creds στο .env, τα χρησιμοποιείς.
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Αλλιώς, Ethereal (test account) auto
  const testAcc = await nodemailer.createTestAccount();

  console.log("📩 Ethereal SMTP ready");
  console.log("   User:", testAcc.user);
  console.log("   Pass:", testAcc.pass);

  return nodemailer.createTransport({
    host: testAcc.smtp.host,
    port: testAcc.smtp.port,
    secure: testAcc.smtp.secure,
    auth: {
      user: testAcc.user,
      pass: testAcc.pass,
    },
  });
}

async function sendEmail({ to, subject, text, html }) {
  if (!transporterPromise) transporterPromise = getTransporter();
  const transporter = await transporterPromise;

  const from = process.env.MAIL_FROM || "HelpDesk <no-reply@helpdesk.local>";

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  // Ethereal preview URL (μόνο σε test account)
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log("✅ Email preview:", preview);

  return { messageId: info.messageId, preview };
}

module.exports = { sendEmail };
