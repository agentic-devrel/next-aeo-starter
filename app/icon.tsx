import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 3,
        padding: 6,
        background: "#f3c85b",
        border: "2px solid #14221c",
      }}
    >
      <div style={{ width: 4, height: 9, background: "#14221c" }} />
      <div style={{ width: 4, height: 18, background: "#14221c" }} />
      <div style={{ width: 4, height: 13, background: "#14221c" }} />
    </div>,
    size,
  );
}
