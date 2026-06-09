import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          flexDirection: "column",
          background: "#F3EEE4",
          borderRadius: 44,
          border: "14px solid #1B1A18",
          overflow: "hidden",
        }}
      >
        <div style={{ background: "#BF4D2C", height: 66, display: "flex" }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 28,
          }}
        >
          <div
            style={{
              background: "#1B1A18",
              height: 14,
              width: 88,
              borderRadius: 8,
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
