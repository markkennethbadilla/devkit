"use client";
import { useState, useRef, useCallback } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function ImageToBase64() {
  const [result, setResult] = useState("");
  const [dataUri, setDataUri] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [mimeType, setMimeType] = useState("");
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { copy, Toast } = useCopyToast();

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setResult("Error: File is not an image");
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const uri = reader.result as string;
      setDataUri(uri);
      setPreview(uri);
      // Extract base64 part (after the comma)
      const base64 = uri.split(",")[1] || "";
      setResult(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) processFile(file);
          break;
        }
      }
    },
    [processFile]
  );

  return (
    <div onPaste={handlePaste}>
      <h1 className="text-3xl font-bold mb-2">Image to Base64 Converter</h1>
      <p className="text-[var(--muted)] mb-6">
        Convert images to Base64 strings and data URIs. Drop, paste, or upload
        an image. Everything runs in your browser.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          dragging
            ? "border-[var(--accent)] bg-[var(--accent)]/5"
            : "border-[var(--border)] hover:border-[var(--accent)]"
        }`}
      >
        <div className="text-4xl mb-3 opacity-50">🖼</div>
        <div className="text-sm text-[var(--muted)]">
          Drop an image here, paste from clipboard, or click to upload
        </div>
        <div className="text-xs text-[var(--muted)] mt-1">
          PNG, JPG, GIF, SVG, WebP
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
        />
      </div>

      {result && !result.startsWith("Error") && (
        <div className="mt-6 space-y-4">
          {preview && (
            <div className="flex justify-center p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 max-w-full object-contain"
              />
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              <div className="text-xs text-[var(--muted)]">File Name</div>
              <div className="text-sm font-mono truncate">{fileName}</div>
            </div>
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              <div className="text-xs text-[var(--muted)]">Original Size</div>
              <div className="text-sm font-mono">{formatBytes(fileSize)}</div>
            </div>
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              <div className="text-xs text-[var(--muted)]">Base64 Size</div>
              <div className="text-sm font-mono">
                {formatBytes(result.length)}
              </div>
            </div>
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              <div className="text-xs text-[var(--muted)]">MIME Type</div>
              <div className="text-sm font-mono">{mimeType}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--muted)]">Data URI</span>
              <button
                onClick={() => copy(dataUri)}
                className="btn-secondary text-xs"
              >
                Copy Data URI
              </button>
            </div>
            <textarea
              value={dataUri}
              readOnly
              rows={3}
              className="font-mono text-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--muted)]">
                Base64 String
              </span>
              <button
                onClick={() => copy(result)}
                className="btn-secondary text-xs"
              >
                Copy Base64
              </button>
            </div>
            <textarea
              value={result}
              readOnly
              rows={3}
              className="font-mono text-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--muted)]">HTML img Tag</span>
              <button
                onClick={() =>
                  copy(`<img src="${dataUri}" alt="${fileName}" />`)
                }
                className="btn-secondary text-xs"
              >
                Copy HTML
              </button>
            </div>
            <pre className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-mono overflow-x-auto whitespace-pre-wrap">
              {`<img src="${dataUri.slice(0, 60)}..." alt="${fileName}" />`}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--muted)]">CSS Background</span>
              <button
                onClick={() =>
                  copy(`background-image: url('${dataUri}');`)
                }
                className="btn-secondary text-xs"
              >
                Copy CSS
              </button>
            </div>
            <pre className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-mono overflow-x-auto whitespace-pre-wrap">
              {`background-image: url('${dataUri.slice(0, 60)}...');`}
            </pre>
          </div>
        </div>
      )}

      {result.startsWith("Error") && (
        <div className="text-red-400 text-sm mt-4 p-3 rounded-lg bg-red-400/10 border border-red-400/20">
          {result}
        </div>
      )}

      <Toast />
    </div>
  );
}
