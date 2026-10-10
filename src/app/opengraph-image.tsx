import { homeImage } from "@/lib/og";

export const alt = "Luan Fabri, front-end engineer at Loopscape";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return homeImage();
}
