import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Studio Vetrina · Siti web su misura per Roma";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F3EEE4",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              background: "#BF4D2C",
              borderRadius: "14px",
            }}
          />
          <span
            style={{
              fontSize: "44px",
              color: "#1B1A18",
              fontFamily: "serif",
              fontWeight: 500,
              letterSpacing: "-1px",
            }}
          >
            vetrina
          </span>
        </div>

        <div
          style={{
            fontSize: "60px",
            color: "#1B1A18",
            fontFamily: "serif",
            fontWeight: 500,
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            maxWidth: "820px",
          }}
        >
          Siti web su misura per Roma
        </div>

        <div
          style={{
            width: "60px",
            height: "3px",
            background: "#BF4D2C",
            marginTop: "36px",
            borderRadius: "2px",
          }}
        />

        <div
          style={{
            fontSize: "20px",
            color: "#8A8578",
            fontFamily: "sans-serif",
            marginTop: "24px",
            letterSpacing: "0.03em",
          }}
        >
          studiovetrina.it
        </div>
      </div>
    ),
    { ...size }
  );
}
