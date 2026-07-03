function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getMailConfig() {
  const to = requireEnv("MAIL_TO");
  const notify = process.env.MAIL_NOTIFY?.trim() || "";

  return {
    host: requireEnv("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    user: requireEnv("SMTP_USER"),
    pass: requireEnv("SMTP_PASS"),
    from: requireEnv("MAIL_FROM"),
    to,
    notify,
    siteUrl:
      process.env.SITE_URL?.trim() || "https://dummyticketverified.com",
    whatsapp: process.env.WHATSAPP_NUMBER?.trim() || "",
  };
}
