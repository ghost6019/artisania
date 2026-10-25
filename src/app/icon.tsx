import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#071525",
          borderRadius: 8,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 6.5 31.5 32H26.2L23.4 25.2H16.6L13.8 32H8.5L20 6.5Z"
            fill="#F4F7FA"
          />
          <path d="M15.35 21.1h9.3v2.35h-9.3V21.1Z" fill="#0F766E" />
          <path d="M20 12.2 23.05 19.4h-6.1L20 12.2Z" fill="#071525" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
