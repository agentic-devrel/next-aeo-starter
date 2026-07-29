import { ImageResponse } from "next/og";

export const alt = "SignalThread documentation release checks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#f7f9f7",
        color: "#14221c",
        fontFamily: "sans-serif",
        border: "24px solid #14221c",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 5,
            padding: 9,
            background: "#f3c85b",
            border: "2px solid #14221c",
          }}
        >
          <div style={{ width: 6, height: 14, background: "#14221c" }} />
          <div style={{ width: 6, height: 29, background: "#14221c" }} />
          <div style={{ width: 6, height: 21, background: "#14221c" }} />
        </div>
        <div style={{ fontSize: 32, fontWeight: 700 }}>SignalThread</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            maxWidth: 930,
            fontSize: 66,
            fontWeight: 750,
            lineHeight: 1.05,
          }}
        >
          Documentation release checks with explicit boundaries.
        </div>
        <div style={{ color: "#51625a", fontSize: 26 }}>
          A fictional example for next-aeo-starter
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
        }}
      >
        <span>Standards first</span>
        <span style={{ color: "#087a58" }}>
          Evidence · versions · canonical URLs
        </span>
      </div>
    </div>,
    size,
  );
}
