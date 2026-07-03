import nodemailer from "nodemailer";
import {
  buildEmailEmbeddedImages,
  buildEmailInlineAttachments,
} from "../src/lib/mail/email-images.ts";
import { buildCustomerConfirmationHtml } from "../src/lib/mail/templates.ts";

const order = {
  email: "test@example.com",
  phone: "9999999999",
  phoneCountryCode: "+91",
  bookingMode: "flight",
  tripType: "one-way",
  passengers: [{ title: "Mr", firstName: "Test", lastName: "User", nationality: "Indian" }],
  from: "DEL",
  to: "BOM",
  departure: "2026-07-10",
};

const images = buildEmailEmbeddedImages();
const attachments = buildEmailInlineAttachments();
const html = buildCustomerConfirmationHtml(
  order,
  "DTV-TEST-123",
  "https://dummyticketverified.com",
  "+918800648490",
  images
);

const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
const info = await transport.sendMail({
  from: "test@example.com",
  to: "user@example.com",
  subject: "Test",
  html,
  attachments,
});

const raw = info.message.toString();
console.log("attachments:", attachments.length);
console.log("Content-ID count:", (raw.match(/Content-ID: /g) || []).length);
console.log("cid refs in html:", (raw.match(/cid:dtv-/g) || []).length);
console.log("multipart/related:", raw.includes("multipart/related"));
