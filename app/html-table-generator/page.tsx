"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

export default function HtmlTableGeneratorPage() {
  const { copy, Toast } = useCopyToast();
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(3);
  const [hasHeader, setHasHeader] = useState(true);
  const [headerStyle, setHeaderStyle] = useState<"bold" | "bg" | "both">("both");
  const [bordered, setBordered] = useState(true);
  const [striped, setStriped] = useState(false);
  const [data, setData] = useState<string[][]>(() =>
    Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 5 }, (_, c) => (r === 0 ? `Header ${c + 1}` : `Row ${r} Col ${c + 1}`))
    )
  );

  const updateCell = (r: number, c: number, val: string) => {
    setData((prev) => {
      const next = prev.map((row) => [...row]);
      while (next.length <= r) next.push(Array(cols).fill(""));
      while (next[r].length <= c) next[r].push("");
      next[r][c] = val;
      return next;
    });
  };

  const htmlCode = useMemo(() => {
    const style: string[] = [];
    if (bordered) {
      style.push("table { border-collapse: collapse; width: 100%; }");
      style.push("th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }");
    } else {
      style.push("table { width: 100%; }");
      style.push("th, td { padding: 8px; text-align: left; }");
    }
    if (hasHeader && (headerStyle === "bg" || headerStyle === "both")) {
      style.push("th { background-color: #f5f5f5; }");
    }
    if (hasHeader && (headerStyle === "bold" || headerStyle === "both")) {
      style.push("th { font-weight: bold; }");
    }
    if (striped) {
      style.push("tr:nth-child(even) { background-color: #fafafa; }");
    }

    let html = "";
    if (style.length) html += `<style>\n  ${style.join("\n  ")}\n</style>\n`;
    html += "<table>\n";
    const startRow = hasHeader ? 1 : 0;

    if (hasHeader) {
      html += "  <thead>\n    <tr>\n";
      for (let c = 0; c < cols; c++) {
        const val = data[0]?.[c] || "";
        html += `      <th>${val}</th>\n`;
      }
      html += "    </tr>\n  </thead>\n";
    }

    html += "  <tbody>\n";
    for (let r = startRow; r < rows; r++) {
      html += "    <tr>\n";
      for (let c = 0; c < cols; c++) {
        const val = data[r]?.[c] || "";
        html += `      <td>${val}</td>\n`;
      }
      html += "    </tr>\n";
    }
    html += "  </tbody>\n</table>";
    return html;
  }, [rows, cols, hasHeader, headerStyle, bordered, striped, data]);

  return (
    <main className="tool-container">
      <h1 className="tool-title">HTML Table Generator</h1>
      <p className="tool-desc">Build HTML tables visually. Edit cells inline, configure styling, and copy the markup.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <label style={{ fontSize: 13 }}>
          Rows: <input type="number" min={1} max={50} value={rows} onChange={(e) => setRows(Math.max(1, +e.target.value || 1))}
          style={{ width: 60, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px", marginLeft: 4 }} />
        </label>
        <label style={{ fontSize: 13 }}>
          Cols: <input type="number" min={1} max={20} value={cols} onChange={(e) => setCols(Math.max(1, +e.target.value || 1))}
          style={{ width: 60, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px", marginLeft: 4 }} />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
          <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} /> Header row
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
          <input type="checkbox" checked={bordered} onChange={(e) => setBordered(e.target.checked)} /> Bordered
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
          <input type="checkbox" checked={striped} onChange={(e) => setStriped(e.target.checked)} /> Striped
        </label>
        {hasHeader && (
          <select value={headerStyle} onChange={(e) => setHeaderStyle(e.target.value as typeof headerStyle)}
            style={{ fontSize: 13, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px" }}>
            <option value="both">Bold + BG</option>
            <option value="bold">Bold only</option>
            <option value="bg">BG only</option>
          </select>
        )}
      </div>

      <div style={{ overflow: "auto", marginBottom: 16 }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            {Array.from({ length: rows }, (_, r) => (
              <tr key={r}>
                {Array.from({ length: cols }, (_, c) => (
                  <td key={c} style={{
                    border: "1px solid var(--border)", padding: 0,
                    background: r === 0 && hasHeader ? "var(--surface)" : "transparent",
                  }}>
                    <input type="text" value={data[r]?.[c] || ""}
                      onChange={(e) => updateCell(r, c, e.target.value)}
                      style={{
                        width: "100%", background: "transparent", color: "var(--foreground)",
                        border: "none", padding: "6px 8px", fontSize: 13, outline: "none",
                        fontWeight: r === 0 && hasHeader ? 600 : 400,
                      }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Generated HTML</div>
      <div style={{ position: "relative" }}>
        <pre style={{
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
          padding: 14, fontSize: 12, fontFamily: "monospace", overflow: "auto", maxHeight: 300,
          color: "var(--foreground)",
        }}>{htmlCode}</pre>
        <button className="btn" onClick={() => copy(htmlCode)}
          style={{ position: "absolute", top: 8, right: 8, fontSize: 11, padding: "4px 10px" }}>Copy HTML</button>
      </div>

      <Toast />
    </main>
  );
}
