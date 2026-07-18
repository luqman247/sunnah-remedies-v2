import {
  createInstitutionalOgImage,
  ogAlt,
  ogContentType,
  ogSize,
} from "@/lib/seo/og/institutional-image";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpenGraphImage() {
  return createInstitutionalOgImage();
}
