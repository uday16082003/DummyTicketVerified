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

function uniqueRecipients(...lists: string[][]): string[] {
  const seen = new Set<string>();
  const recipients: string[] = [];

  for (const list of lists) {
    for (const address of list) {
      const normalized = address.trim().toLowerCase();
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

  const adminRecipients = uniqueRecipients(
    [config.to],
    config.notify ? [config.notify] : []
  );

  const customerBcc = adminRecipients.filter(
    (address) => address.toLowerCase() !== order.email.trim().toLowerCase()
  );

  const customerMail = transporter.sendMail({
    from: config.from,
    to: order.email,
    bcc: customerBcc.length > 0 ? customerBcc : undefined,
    replyTo: config.to,
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

  const adminMail = transporter.sendMail({
    from: config.from,
    to: adminRecipients,
    replyTo: order.email,
    subject: MAIL_COPY.adminSubject(orderPrimaryName(order), orderId),
    text: buildAdminNotificationText(order, orderId, config.siteUrl, config.whatsapp),
    html: buildAdminNotificationHtml(
      order,
      orderId,
      config.siteUrl,
      config.whatsapp,
      images
    ),
    attachments,
    headers: {
      "X-Mailer": "DummyTicketVerified",
      "X-Priority": "1",
    },
  });

  const [customerResult, adminResult] = await Promise.allSettled([
    customerMail,
    adminMail,
  ]);

  if (customerResult.status === "rejected") {
    console.error("[mail] Customer confirmation failed:", customerResult.reason);
  }

  if (adminResult.status === "rejected") {
    console.error("[mail] Admin notification failed:", adminResult.reason);
  }

  if (customerResult.status === "rejected" && adminResult.status === "rejected") {
    throw new Error("Unable to send order emails");
  }
}
