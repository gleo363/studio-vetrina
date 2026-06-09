import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          flexDirection: "column",
          background: "#F3EEE4",
          borderRadius: 8,
          border: "2.5px solid #1B1A18",
          overflow: "hidden",
        }}
      >
        <div style={{ background: "#BF4D2C", height: 12, display: "flex" }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 5,
          }}
        >
          <div
            style={{
              background: "#1B1A18",
              height: 3,
              width: 16,
              borderRadius: 2,
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
