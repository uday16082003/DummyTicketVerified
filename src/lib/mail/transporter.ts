import nodemailer from "nodemailer";
import { getMailConfig } from "@/lib/mail/config";

export function createTransporter() {
  const config = getMailConfig();

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}
