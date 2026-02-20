"use client";
import { useState, useCallback } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function DataUriGeneratorPage() {
  const { copy, Toast } = useCopyToast();
  const [dataUri, setDataUri] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [mimeType, setMimeType] = useState("");
  const [dragging, setDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type || "application/octet-stream");

    const reader = new FileReader();
    reader.onload = () => {
      setDataUri(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const isImage = mimeType.startsWith("image/");
  const uriSize = new Blob([dataUri]).size;
  const overhead = fileSize > 0 ? ((uriSize / fileSize - 1) * 100).toFixed(1) : "0";

  const cssBackground = dataUri ? `background-image: url("${dataUri}");` : "";
  const htmlImg = dataUri && isImage ? `<img src="${dataUri}" alt="${fileName}" />` : "";

  return (
    <main className="tool-container">
      <h1 className="tool-title">Data URI Generator</h1>
      <p className="tool-desc">Convert any file to a Base64 data URI for embedding directly in HTML or CSS. Drag and drop or browse.</p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 8, padding: 40, textAlign: "center",
          background: dragging ? "var(--accent)" + "11" : "var(--surface)",
          cursor: "pointer", marginBottom: 16, transition: "all 0.15s",
        }}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>&#128206;</div>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>
          {dragging ? "Drop file here..." : "Drop a file here or click to browse"}
        </div>
        <input id="file-input" type="file" onChange={handleFileInput} style={{ display: "none" }} />
      </div>

      {dataUri && (
        <>
          {/* File info */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 8, marginBottom: 16,
          }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ color: "var(--muted)", fontSize: 11 }}>File</div>
              <div style={{ fontWeight: 600, fontSize: 13, wordBreak: "break-all" }}>{fileName}</div>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ color: "var(--muted)", fontSize: 11 }}>MIME Type</div>
              <div style={{ fontFamily: "monospace", fontSize: 13 }}>{mimeType}</div>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ color: "var(--muted)", fontSize: 11 }}>Original Size</div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{formatBytes(fileSize)}</div>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ color: "var(--muted)", fontSize: 11 }}>Data URI Size</div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{formatBytes(uriSize)} <span style={{ color: "var(--muted)", fontSize: 11 }}>(+{overhead}%)</span></div>
            </div>
          </div>

          {/* Preview for images */}
          {isImage && (
            <div style={{ marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Preview</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUri} alt="Preview" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, border: "1px solid var(--border)" }} />
            </div>
          )}

          {/* Data URI */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>Data URI</span>
              <button className="btn" onClick={() => copy(dataUri)} style={{ fontSize: 12 }}>Copy Data URI</button>
            </div>
            <textarea value={dataUri} readOnly rows={4}
              style={{
                width: "100%", background: "var(--surface)", color: "var(--foreground)",
                border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px",
                fontSize: 12, fontFamily: "monospace", resize: "vertical",
              }} />
          </div>

          {/* Code snippets */}
          {isImage && htmlImg && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>HTML &lt;img&gt;</span>
                <button className="btn btn-secondary" onClick={() => copy(htmlImg)} style={{ fontSize: 11 }}>Copy</button>
              </div>
              <code style={{
                display: "block", fontSize: 12, fontFamily: "monospace", padding: "8px 10px",
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6,
                wordBreak: "break-all", color: "var(--foreground)",
              }}>{htmlImg.slice(0, 200)}{htmlImg.length > 200 ? "..." : ""}</code>
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>CSS background-image</span>
              <button className="btn btn-secondary" onClick={() => copy(cssBackground)} style={{ fontSize: 11 }}>Copy</button>
            </div>
            <code style={{
              display: "block", fontSize: 12, fontFamily: "monospace", padding: "8px 10px",
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6,
              wordBreak: "break-all", color: "var(--foreground)",
            }}>{cssBackground.slice(0, 200)}{cssBackground.length > 200 ? "..." : ""}</code>
          </div>
        </>
      )}

      <Toast />
    </main>
  );
}
