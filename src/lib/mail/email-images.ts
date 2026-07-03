import type { Attachment } from "nodemailer/lib/mailer";
import { GENERATED_EMAIL_IMAGES } from "@/lib/mail/email-images.generated";

export type EmailEmbeddedImages = {
  brandLogo: string;
  airlines: readonly { name: string; cid: string }[];
};

const BRAND_LOGO_CID = "dtv-brand-logo";

function parseDataUri(dataUri: string): { contentType: string; content: Buffer } {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid embedded email image data URI");
  }

  return {
    contentType: match[1],
    content: Buffer.from(match[2], "base64"),
  };
}

function inlineAttachment(
  dataUri: string,
  cid: string,
  filename: string
): Attachment {
  const { contentType, content } = parseDataUri(dataUri);
  return {
    filename,
    content,
    cid,
    contentType,
    contentDisposition: "inline",
  };
}

export function buildEmailEmbeddedImages(): EmailEmbeddedImages {
  return {
    brandLogo: BRAND_LOGO_CID,
    airlines: GENERATED_EMAIL_IMAGES.airlines.map((airline, index) => ({
      name: airline.name,
      cid: `dtv-airline-${index}`,
    })),
  };
}

export function buildEmailInlineAttachments(): Attachment[] {
  const attachments: Attachment[] = [
    inlineAttachment(
      GENERATED_EMAIL_IMAGES.brandLogo,
      BRAND_LOGO_CID,
      "dummy-logo-icon.png"
    ),
  ];

  GENERATED_EMAIL_IMAGES.airlines.forEach((airline, index) => {
    attachments.push(
      inlineAttachment(airline.src, `dtv-airline-${index}`, `${index}-airline.png`)
    );
  });

  return attachments;
}
