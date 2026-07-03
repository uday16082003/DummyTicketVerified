import { getMailConfig } from "@/lib/mail/config";
import {
  buildEmailEmbeddedImages,
  buildEmailInlineAttachments,
} from "@/lib/mail/email-images";
import {
  MAIL_COPY,
  buildAdminNotificationHtml,
  buildAdminNotificationText,
  buildCustomerConfirmationHtml,
  buildCustomerConfirmationText,
} from "@/lib/mail/templates";
import { createTransporter } from "@/lib/mail/transporter";
import type { OrderPayload } from "@/types/order";
import { orderPrimaryName } from "@/types/order";

function normalizeEmail(value: string): string {
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] ?? value).trim().toLowerCase();
}

function uniqueRecipients(...lists: string[][]): string[] {
  const seen = new Set<string>();
  const recipients: string[] = [];

  for (const list of lists) {
    for (const address of list) {
      const normalized = normalizeEmail(address);
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      recipients.push(address.trim());
    }
  }

  return recipients;
}

export async function sendOrderEmails(order: OrderPayload, orderId: string) {
  const config = getMailConfig();
  const transporter = createTransporter();
  const images = buildEmailEmbeddedImages();
  const attachments = buildEmailInlineAttachments();

  const smtpMailbox = normalizeEmail(config.user);
  const adminInbox = config.to.trim();
  const adminInboxNormalized = normalizeEmail(adminInbox);
  const customerEmail = order.email.trim();
  const customerNormalized = normalizeEmail(customerEmail);
  const isSelfAdminInbox = adminInboxNormalized === smtpMailbox;

  const notifyRecipients = uniqueRecipients(
    config.notify ? [config.notify] : [],
    isSelfAdminInbox ? [] : [adminInbox]
  );

  const inboxCopyRecipients = uniqueRecipients(
    [adminInbox],
    config.notify ? [config.notify] : []
  ).filter((address) => normalizeEmail(address) !== customerNormalized);

  const customerMail = transporter.sendMail({
    from: config.from,
    to: customerEmail,
    cc: inboxCopyRecipients.length > 0 ? inboxCopyRecipients : undefined,
    replyTo: adminInbox,
    subject: MAIL_COPY.customerSubject(orderId),
    text: buildCustomerConfirmationText(order, orderId, config.siteUrl, config.whatsapp),
    html: buildCustomerConfirmationHtml(
      order,
      orderId,
      config.siteUrl,
      config.whatsapp,
      images
    ),
    attachments,
  });

  const adminText = buildAdminNotificationText(
    order,
    orderId,
    config.siteUrl,
    config.whatsapp
  );
  const adminHtml = buildAdminNotificationHtml(
    order,
    orderId,
    config.siteUrl,
    config.whatsapp,
    images
  );
  const adminSubject = MAIL_COPY.adminSubject(orderPrimaryName(order), orderId);

  const adminMailTargets = notifyRecipients.length > 0 ? notifyRecipients : [];

  const adminMail =
    adminMailTargets.length > 0
      ? transporter.sendMail({
          from: config.from,
          to: adminMailTargets,
          replyTo: customerEmail,
          subject: adminSubject,
          text: adminText,
          html: adminHtml,
          attachments,
        })
      : null;

  const selfAdminMail = isSelfAdminInbox
    ? transporter.sendMail({
        from: config.from,
        to: adminInbox,
        replyTo: customerEmail,
        subject: adminSubject,
        text: adminText,
        html: adminHtml,
      })
    : null;

  const results = await Promise.allSettled(
    [customerMail, adminMail, selfAdminMail].filter(Boolean) as Promise<unknown>[]
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`[mail] Send attempt ${index + 1} failed:`, result.reason);
    }
  });

  const customerResult = results[0];
  if (!customerResult || customerResult.status === "rejected") {
    throw new Error("Unable to send customer confirmation email");
  }

  console.info(
    `[mail] Order ${orderId} emailed to ${customerEmail}` +
      (inboxCopyRecipients.length > 0
        ? `; inbox copy cc: ${inboxCopyRecipients.join(", ")}`
        : "") +
      (adminMailTargets.length > 0
        ? `; admin alert: ${adminMailTargets.join(", ")}`
        : isSelfAdminInbox
          ? `; self-admin text fallback: ${adminInbox}`
          : "")
  );
}
