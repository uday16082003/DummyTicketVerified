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

export async function sendOrderEmails(order: OrderPayload, orderId: string) {
  const config = getMailConfig();
  const transporter = createTransporter();
  const images = buildEmailEmbeddedImages();

  await transporter.sendMail({
    from: config.from,
    to: order.email,
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
    attachments: buildEmailInlineAttachments(),
  });

  await transporter.sendMail({
    from: config.from,
    to: config.to,
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
    attachments: buildEmailInlineAttachments(),
  });
}
