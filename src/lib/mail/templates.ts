import { CTA_CONTACT } from "@/constants/cta-assets";
import type { EmailEmbeddedImages } from "@/lib/mail/email-images";
import { getTicketPurposeLabel } from "@/constants/ticket-purposes";
import type { OrderPayload } from "@/types/order";
import { orderPrimaryName, passengerFullName } from "@/types/order";

/**
 * Customize email copy here — subjects, headings, and footer text.
 * HTML layout functions below use these strings automatically.
 */
export const MAIL_COPY = {
  brandName: "DummyTicketVerified",
  brandTitle: "DummyTicketVerified",
  customerSubject: (orderId: string) => `Order Confirmed — ${orderId}`,
  adminSubject: (name: string, orderId: string) => `New order from ${name} (${orderId})`,
  customerDocumentLabel: "ORDER CONFIRMATION",
  adminDocumentLabel: "NEW BOOKING REQUEST",
  deliveryWindow: "15 to 30 minutes",
  adminIntro: "A customer submitted the order form. Details are below.",
  footerAirlinesHeading: "SAMPLE TICKETS FROM AIRLINES WE SUPPORT",
  footerQuestions: "Questions? Reply to this message or WhatsApp",
  copyright: "© 2026 DummyTicketVerified. All rights reserved.",
};

const BOOKING_MODE_LABELS: Record<OrderPayload["bookingMode"], string> = {
  flight: "Flight Ticket",
  hotel: "Hotel Booking",
  "flight-hotel": "Flight + Hotel",
};

const TRIP_TYPE_LABELS: Record<NonNullable<OrderPayload["tripType"]>, string> = {
  "one-way": "One Way",
  "round-trip": "Round Trip",
  "multi-trip": "Multi Trip",
};

const PREPARED_SERVICE_LABELS: Record<OrderPayload["bookingMode"], string> = {
  flight: "Flight ticket",
  hotel: "Hotel booking",
  "flight-hotel": "Flight ticket and hotel booking",
};

function resolvePreparedServiceLabel(order: OrderPayload): string {
  if (order.bookingMode === "flight" && order.includeHotel) {
    return "Flight ticket and hotel booking";
  }
  return PREPARED_SERVICE_LABELS[order.bookingMode];
}

function buildCustomerIntroText(order: OrderPayload): string {
  const passengerCount = order.passengers.length;
  const passengerLabel = passengerCount === 1 ? "passenger" : "passengers";
  const serviceLabel = resolvePreparedServiceLabel(order);

  return `Hello ${orderPrimaryName(order)}, Thank you for choosing ${MAIL_COPY.brandTitle}. Your request is confirmed. We are preparing your ${serviceLabel} for ${passengerCount} ${passengerLabel}. Delivery is typically within ${MAIL_COPY.deliveryWindow}.`;
}

function renderCustomerIntro(order: OrderPayload): string {
  const passengerCount = order.passengers.length;
  const passengerLabel = passengerCount === 1 ? "passenger" : "passengers";
  const serviceLabel = resolvePreparedServiceLabel(order);

  return `<p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#334155;">
    Hello ${escapeHtml(orderPrimaryName(order))}, Thank you for choosing ${escapeHtml(MAIL_COPY.brandTitle)}. Your request is confirmed. We are preparing your <strong style="color:#0d9488;">${escapeHtml(serviceLabel)}</strong> for <strong>${passengerCount}</strong> ${passengerLabel}. Delivery is typically within <strong>${escapeHtml(MAIL_COPY.deliveryWindow)}</strong>.
  </p>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatSiteHost(siteUrl: string): string {
  try {
    return new URL(siteUrl).hostname.replace(/^www\./, "");
  } catch {
    return siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

function resolveWhatsappDisplay(whatsapp: string): string {
  const value = whatsapp.trim() || CTA_CONTACT.phoneDisplay;
  if (value.includes(" ")) return value;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return value.startsWith("+") ? value : `+${value}`;
}

function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function buildOrderSummaryLines(order: OrderPayload, orderId: string): string[] {
  const lines: string[] = [
    `Order ID: ${orderId}`,
    `Email: ${order.email}`,
    `Phone: ${order.phoneCountryCode} ${order.phone}`,
    `Purpose: ${getTicketPurposeLabel(order.purpose)}`,
    `Service: ${BOOKING_MODE_LABELS[order.bookingMode]}`,
  ];

  order.passengers.forEach((passenger, index) => {
    const label = index === 0 ? "Primary passenger" : `Passenger ${index + 1}`;
    lines.push(
      `${label}: ${passengerFullName(passenger)} (${passenger.nationality})`
    );
  });

  if (order.tripType) {
    lines.push(`Trip type: ${TRIP_TYPE_LABELS[order.tripType]}`);
  }
  if (order.includeHotel && order.bookingMode === "flight") {
    lines.push("Hotel add-on: Yes");
  }
  if (order.from) lines.push(`From: ${order.from}`);
  if (order.to) lines.push(`To: ${order.to}`);
  if (order.departure) lines.push(`Departure: ${formatDate(order.departure)}`);
  if (order.returnDate) lines.push(`Return: ${formatDate(order.returnDate)}`);
  if (order.city) lines.push(`City: ${order.city}`);
  if (order.checkIn) lines.push(`Check-in: ${formatDate(order.checkIn)}`);
  if (order.checkOut) lines.push(`Check-out: ${formatDate(order.checkOut)}`);

  return lines;
}

function renderOrderIdBox(orderId: string): string {
  return `<div style="margin:0 0 20px;padding:16px 20px;border-radius:12px;background:#f0fdfa;border:1px solid #99f6e4;text-align:center;">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#0d9488;font-weight:700;">Your Order ID</p>
    <p style="margin:0;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:0.03em;font-family:'Courier New',monospace;">${escapeHtml(orderId)}</p>
  </div>`;
}

function renderSummaryTable(order: OrderPayload, orderId: string): string {
  const rows = buildOrderSummaryLines(order, orderId)
    .map((line) => {
      const [label, ...rest] = line.split(": ");
      const value = rest.join(": ");
      return `<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px;width:140px;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(value)}</td></tr>`;
    })
    .join("");

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#f8fafc;border-radius:12px;overflow:hidden;">${rows}</table>`;
}

function renderNextStepBox(email: string): string {
  return `<div style="margin:20px 0 0;padding:16px 18px;border-radius:10px;background:#f8f9fa;">
    <p style="margin:0;font-size:14px;line-height:1.65;color:#334155;">
      <strong style="color:#0f172a;">Next step:</strong> We will send your documents to
      <a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:underline;font-weight:600;">${escapeHtml(email)}</a>
      and your WhatsApp number on file.
    </p>
  </div>`;
}

function buildCustomerNextStepText(email: string): string {
  return `Next step: We will send your documents to ${email} and your WhatsApp number on file.`;
}

function renderEmailHeader(images: EmailEmbeddedImages, documentLabel: string): string {
  return `<tr>
    <td style="padding:0;background:#ffffff;border-bottom:1px solid #e2e8f0;">
      <div style="height:4px;background:#14b8a6;line-height:4px;font-size:0;">&nbsp;</div>
      <div style="padding:28px 28px 20px;text-align:center;">
        <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto;">
          <tr>
            <td style="padding:0 12px 0 0;vertical-align:middle;">
              <img src="cid:${images.brandLogo}" alt="" width="52" height="48" style="display:block;width:52px;height:auto;" />
            </td>
            <td style="padding:0;vertical-align:middle;text-align:left;">
              <p style="margin:0;font-size:18px;line-height:1.2;font-weight:800;letter-spacing:0.01em;color:#1e3a8a;">${escapeHtml(MAIL_COPY.brandTitle)}</p>
            </td>
          </tr>
        </table>
        <p style="margin:22px 0 0;font-size:13px;line-height:1.2;letter-spacing:0.16em;text-transform:uppercase;color:#94a3b8;font-weight:600;">${escapeHtml(documentLabel)}</p>
        <div style="margin:18px auto 0;max-width:420px;height:1px;background:#e2e8f0;line-height:1px;font-size:0;">&nbsp;</div>
      </div>
    </td>
  </tr>`;
}

function renderAirlineLogoGrid(images: EmailEmbeddedImages): string {
  const rows: string[] = [];

  for (let row = 0; row < 3; row += 1) {
    const cells = images.airlines.slice(row * 3, row * 3 + 3)
      .map((airline) => {
        return `<td align="center" valign="middle" style="padding:8px;width:33%;">
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:10px 8px;min-height:44px;">
            <img src="cid:${airline.cid}" alt="${escapeHtml(airline.name)}" height="28" style="display:block;margin:0 auto;max-width:100%;height:28px;width:auto;" />
          </div>
        </td>`;
      })
      .join("");

    rows.push(`<tr>${cells}</tr>`);
  }

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 auto;max-width:420px;">${rows.join("")}</table>`;
}

function renderEmailFooter(siteUrl: string, whatsapp: string, images: EmailEmbeddedImages): string {
  const siteHost = formatSiteHost(siteUrl);
  const whatsappDisplay = resolveWhatsappDisplay(whatsapp);
  const whatsappDigits = whatsappDisplay.replace(/\D/g, "");

  return `<tr>
    <td style="padding:28px 24px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="margin:0 0 16px;font-size:11px;line-height:1.4;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;font-weight:600;">${escapeHtml(MAIL_COPY.footerAirlinesHeading)}</p>
      ${renderAirlineLogoGrid(images)}
      <p style="margin:24px 0 8px;font-size:14px;line-height:1.6;color:#475569;">
        ${escapeHtml(MAIL_COPY.footerQuestions)} <strong style="color:#0f172a;">${escapeHtml(whatsappDisplay)}</strong>
      </p>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.6;">
        <a href="${escapeHtml(siteUrl)}" style="color:#2563eb;text-decoration:underline;">${escapeHtml(siteHost)}</a>
      </p>
      <p style="margin:0;font-size:12px;line-height:1.5;color:#cbd5e1;">${escapeHtml(MAIL_COPY.copyright)}</p>
      ${whatsappDigits ? `<span style="display:none;">wa:${escapeHtml(whatsappDigits)}</span>` : ""}
    </td>
  </tr>`;
}

function emailShell(
  siteUrl: string,
  whatsapp: string,
  images: EmailEmbeddedImages,
  documentLabel: string,
  intro: string,
  body: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.06);">
            ${renderEmailHeader(images, documentLabel)}
            <tr>
              <td style="padding:24px 28px 28px;color:#334155;font-size:15px;line-height:1.7;">
                ${intro ? `<p style="margin:0 0 20px;">${escapeHtml(intro)}</p>` : ""}
                ${body}
              </td>
            </tr>
            ${renderEmailFooter(siteUrl, whatsapp, images)}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildFooterTextLines(siteUrl: string, whatsapp: string): string[] {
  const whatsappDisplay = resolveWhatsappDisplay(whatsapp);
  const siteHost = formatSiteHost(siteUrl);

  return [
    "",
    MAIL_COPY.footerAirlinesHeading,
    "",
    `${MAIL_COPY.footerQuestions} ${whatsappDisplay}`,
    siteHost,
    siteUrl,
    MAIL_COPY.copyright,
  ];
}

export function buildCustomerConfirmationHtml(
  order: OrderPayload,
  orderId: string,
  siteUrl: string,
  whatsapp: string,
  images: EmailEmbeddedImages
): string {
  return emailShell(
    siteUrl,
    whatsapp,
    images,
    MAIL_COPY.customerDocumentLabel,
    "",
    `${renderCustomerIntro(order)}${renderOrderIdBox(orderId)}${renderSummaryTable(order, orderId)}${renderNextStepBox(order.email)}`
  );
}

export function buildAdminNotificationHtml(
  order: OrderPayload,
  orderId: string,
  siteUrl: string,
  whatsapp: string,
  images: EmailEmbeddedImages
): string {
  return emailShell(
    siteUrl,
    whatsapp,
    images,
    MAIL_COPY.adminDocumentLabel,
    `${MAIL_COPY.adminIntro} Reply directly to ${order.email} to contact the customer.`,
    `${renderOrderIdBox(orderId)}${renderSummaryTable(order, orderId)}`
  );
}

export function buildCustomerConfirmationText(
  order: OrderPayload,
  orderId: string,
  siteUrl: string,
  whatsapp: string
): string {
  return [
    MAIL_COPY.brandTitle,
    MAIL_COPY.customerDocumentLabel,
    "",
    buildCustomerIntroText(order),
    "",
    ...buildOrderSummaryLines(order, orderId),
    "",
    buildCustomerNextStepText(order.email),
    ...buildFooterTextLines(siteUrl, whatsapp),
  ].join("\n");
}

export function buildAdminNotificationText(
  order: OrderPayload,
  orderId: string,
  siteUrl: string,
  whatsapp: string
): string {
  return [
    MAIL_COPY.brandTitle,
    MAIL_COPY.adminDocumentLabel,
    "",
    MAIL_COPY.adminIntro,
    "",
    ...buildOrderSummaryLines(order, orderId),
    "",
    `Reply to: ${order.email}`,
    ...buildFooterTextLines(siteUrl, whatsapp),
  ].join("\n");
}
