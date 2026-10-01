import { ImageResponse } from "next/og";

export const alt = "Vorx Industrial Solutions - Industrial Flooring & Protective Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#14110b", color: "#f4efe4", fontFamily: "Arial, sans-serif" }}>
        <div style={{ fontSize: 24, letterSpacing: 4, color: "#ffc425", textTransform: "uppercase", fontWeight: 700 }}>Industrial flooring · protective systems</div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1, letterSpacing: -4, marginTop: 28, display: "flex", flexWrap: "wrap" }}>
          Build the floor your operation&nbsp;<span style={{ color: "#ffc425" }}>depends on.</span>
        </div>
        <div style={{ fontSize: 30, marginTop: 40, color: "#d7d1c2" }}>Vorx Industrial Solutions · Mumbai · Across India</div>
      </div>
    ),
    size,
  );
}
