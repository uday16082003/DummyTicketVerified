import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(root, ".env.local"));

function readAsset(relativePath) {
  return fs.readFileSync(path.join(root, "public", relativePath));
}

const brandLogo = "brand-logo";
const airlineCids = ["airline-0", "airline-1", "airline-2"];

const attachments = [
  {
    filename: "dummy-logo-icon.png",
    content: readAsset("dummy-logo-icon.png"),
    cid: brandLogo,
    contentDisposition: "inline",
    contentType: "image/png",
  },
  {
    filename: "Emirates_logo.svg.png",
    content: readAsset("logos/Emirates_logo.svg.png"),
    cid: airlineCids[0],
    contentDisposition: "inline",
    contentType: "image/png",
  },
];

const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;padding:20px;">
  <h2>CID image test</h2>
  <p>Brand logo:</p>
  <img src="cid:${brandLogo}" width="52" alt="logo" />
  <p>Airline logo:</p>
  <img src="cid:${airlineCids[0]}" height="28" alt="Emirates" />
</body></html>`;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const to = process.env.MAIL_TO;
if (!to) {
  throw new Error("MAIL_TO missing");
}

const info = await transporter.sendMail({
  from: process.env.MAIL_FROM,
  to,
  subject: "CID image test - DummyTicketVerified",
  html,
  attachments,
});

console.log("Sent test email:", info.messageId);
