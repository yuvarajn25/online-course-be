import _ from "lodash";
import { EMAIL_TYPES } from "../constants";
import * as nodemailer from "nodemailer";

const templateFiles = {
  [EMAIL_TYPES.SUBSCRIPTION]: require("../templates/subscription.html.template"),
};

// compile templates
const templates = {};
Object.keys(templateFiles).forEach((filename) => {
  const rawTemplate = templateFiles[filename];
  templates[filename] = _.template(rawTemplate);
});

export async function sendEmail(template, content, emailProps) {
  console.log(
    `SendEmil:: `,
    JSON.stringify({ template, content, emailProps }, 0, 2)
  );

  const html = templates[template](content);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let info = await transporter.sendMail({
    ...emailProps,
    html,
  });

  console.log("Message sent: %s", info.messageId);
}
