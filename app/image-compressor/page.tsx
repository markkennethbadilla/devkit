"use client";
import { useState, useRef, useCallback } from "react";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [compressed, setCompressed] = useState("");
  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/webp");
  const [origSize, setOrigSize] = useState(0);
  const [compSize, setCompSize] = useState(0);
  const [origDims, setOrigDims] = useState({ w: 0, h: 0 });
  const [compDims, setCompDims] = useState({ w: 0, h: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const compress = useCallback((f: File, q: number, mw: number, mh: number, fmt: string) => {
    const img = new Image();
    const url = URL.createObjectURL(f);
    img.onload = () => {
      setOrigDims({ w: img.width, h: img.height });
      let w = img.width;
      let h = img.height;
      if (w > mw) { h = h * (mw / w); w = mw; }
      if (h > mh) { w = w * (mh / h); h = mh; }
      w = Math.round(w);
      h = Math.round(h);
      setCompDims({ w, h });

      const canvas = canvasRef.current || document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL(fmt, q);
      setCompressed(dataUrl);
      const byteString = atob(dataUrl.split(",")[1]);
      setCompSize(byteString.length);
      URL.revokeObjectURL(url);
    };
    img.src = url;
    setPreview(url);
    setOrigSize(f.size);
  }, []);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    compress(f, quality, maxWidth, maxHeight, format);
  };

  const recompress = () => {
    if (file) compress(file, quality, maxWidth, maxHeight, format);
  };

  const download = () => {
    if (!compressed) return;
    const ext = format === "image/webp" ? "webp" : format === "image/png" ? "png" : "jpg";
    const a = document.createElement("a");
    a.download = `compressed.${ext}`;
    a.href = compressed;
    a.click();
  };

  const savings = origSize > 0 ? ((1 - compSize / origSize) * 100).toFixed(1) : "0";

  return (
    <main className="tool-container">
      <h1 className="tool-title">Image Compressor</h1>
      <p className="tool-desc">Compress and resize images entirely in your browser. No upload needed — everything stays private.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => fileRef.current?.click()}
        style={{
          border: "2px dashed var(--border)", borderRadius: 12, padding: 32,
          textAlign: "center", cursor: "pointer", marginBottom: 16,
          background: "var(--surface)",
        }}>
        <input ref={fileRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          style={{ display: "none" }} />
        <div style={{ fontSize: 14, color: "var(--muted)" }}>
          {file ? file.name : "Drop image here or click to browse"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <label style={{ fontSize: 12 }}>
          Quality: {Math.round(quality * 100)}%
          <input type="range" min={0.1} max={1} step={0.05} value={quality}
            onChange={(e) => setQuality(+e.target.value)}
            style={{ width: 120, marginLeft: 6, verticalAlign: "middle" }} />
        </label>
        <label style={{ fontSize: 12 }}>
          Max W: <input type="number" min={1} max={10000} value={maxWidth}
          onChange={(e) => setMaxWidth(+e.target.value || 1920)}
          style={{ width: 70, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "3px 6px", fontSize: 12 }} />
        </label>
        <label style={{ fontSize: 12 }}>
          Max H: <input type="number" min={1} max={10000} value={maxHeight}
          onChange={(e) => setMaxHeight(+e.target.value || 1080)}
          style={{ width: 70, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "3px 6px", fontSize: 12 }} />
        </label>
        <label style={{ fontSize: 12 }}>
          Format: <select value={format} onChange={(e) => setFormat(e.target.value as typeof format)}
          style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "3px 6px", fontSize: 12 }}>
            <option value="image/webp">WebP</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
          </select>
        </label>
        <button className="btn btn-secondary" onClick={recompress} style={{ fontSize: 12 }}>Re-compress</button>
      </div>

      {file && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginBottom: 16 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Original</div>
              <div style={{ fontWeight: 600 }}>{formatBytes(origSize)}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{origDims.w} x {origDims.h}</div>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Compressed</div>
              <div style={{ fontWeight: 600 }}>{formatBytes(compSize)}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{compDims.w} x {compDims.h}</div>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Savings</div>
              <div style={{ fontWeight: 600, color: +savings > 0 ? "#22c55e" : "#ef4444" }}>{savings}%</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{formatBytes(origSize - compSize)} saved</div>
            </div>
          </div>

          <button className="btn" onClick={download} style={{ marginBottom: 16 }}>Download Compressed</button>

          {compressed && (
            <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", background: "var(--surface)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={compressed} alt="Compressed preview" style={{ maxWidth: "100%", height: "auto", display: "block" }} />
            </div>
          )}
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </main>
  );
}
