"use client";

import { useState } from "react";

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  category: string;
}

const DEVICES: DevicePreset[] = [
  { name: "iPhone SE", width: 375, height: 667, category: "Mobile" },
  { name: "iPhone 14", width: 390, height: 844, category: "Mobile" },
  { name: "iPhone 14 Pro Max", width: 430, height: 932, category: "Mobile" },
  { name: "Samsung Galaxy S21", width: 360, height: 800, category: "Mobile" },
  { name: "Pixel 7", width: 412, height: 915, category: "Mobile" },
  { name: "iPad Mini", width: 768, height: 1024, category: "Tablet" },
  { name: "iPad Air", width: 820, height: 1180, category: "Tablet" },
  { name: "iPad Pro 12.9", width: 1024, height: 1366, category: "Tablet" },
  { name: "Surface Pro 7", width: 912, height: 1368, category: "Tablet" },
  { name: "Laptop", width: 1366, height: 768, category: "Desktop" },
  { name: "MacBook Air", width: 1440, height: 900, category: "Desktop" },
  { name: "Desktop HD", width: 1920, height: 1080, category: "Desktop" },
  { name: "Desktop 2K", width: 2560, height: 1440, category: "Desktop" },
];

export default function ResponsiveTesterPage() {
  const [url, setUrl] = useState("https://example.com");
  const [activeUrl, setActiveUrl] = useState("https://example.com");
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICES[0]);
  const [customWidth, setCustomWidth] = useState(375);
  const [customHeight, setCustomHeight] = useState(667);
  const [isCustom, setIsCustom] = useState(false);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");

  const width = isCustom
    ? orientation === "landscape"
      ? customHeight
      : customWidth
    : orientation === "landscape"
    ? selectedDevice.height
    : selectedDevice.width;
  const height = isCustom
    ? orientation === "landscape"
      ? customWidth
      : customHeight
    : orientation === "landscape"
    ? selectedDevice.width
    : selectedDevice.height;

  const handleLoad = () => {
    let u = url.trim();
    if (u && !u.startsWith("http://") && !u.startsWith("https://")) {
      u = "https://" + u;
    }
    setActiveUrl(u);
  };

  const categories = ["Mobile", "Tablet", "Desktop"];

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>
        Responsive Design Tester
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Preview any website at different device screen sizes. Some sites may block iframe embedding.
      </p>

      {/* URL input */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLoad()}
          placeholder="https://example.com"
          style={{
            flex: 1,
            padding: "8px 12px",
            fontSize: "0.9rem",
            border: "1px solid var(--border)",
            borderRadius: 8,
            background: "var(--surface)",
            color: "var(--foreground)",
          }}
        />
        <button className="btn" onClick={handleLoad}>
          Load
        </button>
      </div>

      {/* Device presets */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "1rem", alignItems: "flex-start" }}>
        {categories.map((cat) => (
          <div key={cat}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase" }}>
              {cat}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {DEVICES.filter((d) => d.category === cat).map((device) => (
                <button
                  key={device.name}
                  onClick={() => {
                    setSelectedDevice(device);
                    setIsCustom(false);
                  }}
                  style={{
                    padding: "3px 8px",
                    fontSize: "0.75rem",
                    borderRadius: 6,
                    border: "1px solid",
                    borderColor:
                      !isCustom && selectedDevice.name === device.name
                        ? "var(--accent)"
                        : "var(--border)",
                    background:
                      !isCustom && selectedDevice.name === device.name
                        ? "var(--accent)"
                        : "var(--surface)",
                    color:
                      !isCustom && selectedDevice.name === device.name
                        ? "white"
                        : "var(--foreground)",
                    cursor: "pointer",
                  }}
                >
                  {device.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Controls row */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <button
          className={isCustom ? "btn" : "btn-secondary"}
          onClick={() => setIsCustom(!isCustom)}
          style={{ fontSize: "0.8rem" }}
        >
          Custom Size
        </button>

        {isCustom && (
          <>
            <input
              type="number"
              value={customWidth}
              onChange={(e) => setCustomWidth(Number(e.target.value))}
              style={{
                width: 70,
                padding: "4px 6px",
                fontSize: "0.82rem",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface)",
                color: "var(--foreground)",
                textAlign: "center",
              }}
            />
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>x</span>
            <input
              type="number"
              value={customHeight}
              onChange={(e) => setCustomHeight(Number(e.target.value))}
              style={{
                width: 70,
                padding: "4px 6px",
                fontSize: "0.82rem",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface)",
                color: "var(--foreground)",
                textAlign: "center",
              }}
            />
          </>
        )}

        <button
          className="btn-secondary"
          onClick={() => setOrientation(orientation === "portrait" ? "landscape" : "portrait")}
          style={{ fontSize: "0.8rem" }}
        >
          {orientation === "portrait" ? "Portrait" : "Landscape"} ↻
        </button>

        <span style={{ fontSize: "0.82rem", color: "var(--muted)", marginLeft: "auto" }}>
          {width} x {height}px
          {!isCustom && ` — ${selectedDevice.name}`}
        </span>
      </div>

      {/* Preview area */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
          background: "var(--surface)",
          borderRadius: 12,
          border: "1px solid var(--border)",
          overflow: "auto",
          minHeight: 500,
        }}
      >
        <div
          style={{
            width: Math.min(width, 1200),
            height: Math.min(height, 800),
            border: "2px solid var(--border)",
            borderRadius: 8,
            overflow: "hidden",
            background: "white",
            flexShrink: 0,
          }}
        >
          <iframe
            src={activeUrl}
            title="Responsive preview"
            style={{
              width: width,
              height: height,
              border: "none",
              transformOrigin: "top left",
              transform: `scale(${Math.min(1, Math.min(1200, typeof window !== "undefined" ? window.innerWidth - 100 : 1200) / width)})`,
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </main>
  );
}
