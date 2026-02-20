"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface GridItem {
  id: number;
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
}

export default function GridGeneratorPage() {
  const { copy, Toast } = useCopyToast();

  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [colGap, setColGap] = useState(8);
  const [rowGap, setRowGap] = useState(8);
  const [colSizes, setColSizes] = useState("1fr 1fr 1fr");
  const [rowSizes, setRowSizes] = useState("1fr 1fr 1fr");
  const [items, setItems] = useState<GridItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const addItem = () => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 2 }]);
    setSelectedItem(id);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItem === id) setSelectedItem(null);
  };

  const updateItem = (id: number, field: keyof Omit<GridItem, "id">, value: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const updateColCount = (n: number) => {
    setColumns(n);
    setColSizes(Array(n).fill("1fr").join(" "));
  };

  const updateRowCount = (n: number) => {
    setRows(n);
    setRowSizes(Array(n).fill("1fr").join(" "));
  };

  const containerCSS = useMemo(() => {
    const lines = [
      "display: grid;",
      `grid-template-columns: ${colSizes};`,
      `grid-template-rows: ${rowSizes};`,
    ];
    if (colGap === rowGap) {
      if (colGap > 0) lines.push(`gap: ${colGap}px;`);
    } else {
      lines.push(`column-gap: ${colGap}px;`);
      lines.push(`row-gap: ${rowGap}px;`);
    }
    return lines.join("\n");
  }, [colSizes, rowSizes, colGap, rowGap]);

  const itemCSS = useMemo(() => {
    if (items.length === 0) return "";
    return items
      .map((item, idx) => {
        const lines = [];
        lines.push(`.item-${idx + 1} {`);
        lines.push(`  grid-column: ${item.colStart} / ${item.colEnd};`);
        lines.push(`  grid-row: ${item.rowStart} / ${item.rowEnd};`);
        lines.push("}");
        return lines.join("\n");
      })
      .join("\n\n");
  }, [items]);

  const fullCSS = itemCSS ? `${containerCSS}\n\n${itemCSS}` : containerCSS;

  const sel = selectedItem !== null ? items.find((i) => i.id === selectedItem) : null;

  return (
    <main className="tool-container">
      <h1 className="tool-title">CSS Grid Generator</h1>
      <p className="tool-desc">
        Create CSS Grid layouts visually. Adjust columns, rows, gaps, and positioned items.
      </p>

      {/* Controls */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Columns</span>
          <input type="number" min={1} max={12} value={columns} onChange={(e) => updateColCount(Math.max(1, Number(e.target.value)))}
            style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px", fontFamily: "monospace" }} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Rows</span>
          <input type="number" min={1} max={12} value={rows} onChange={(e) => updateRowCount(Math.max(1, Number(e.target.value)))}
            style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px", fontFamily: "monospace" }} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Column Gap</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="range" min={0} max={40} value={colGap} onChange={(e) => setColGap(Number(e.target.value))} style={{ flex: 1 }} />
            <span style={{ fontFamily: "monospace", minWidth: 32 }}>{colGap}px</span>
          </div>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Row Gap</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="range" min={0} max={40} value={rowGap} onChange={(e) => setRowGap(Number(e.target.value))} style={{ flex: 1 }} />
            <span style={{ fontFamily: "monospace", minWidth: 32 }}>{rowGap}px</span>
          </div>
        </label>
      </div>

      {/* Template sizes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Column sizes</span>
          <input type="text" value={colSizes} onChange={(e) => setColSizes(e.target.value)}
            style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px", fontFamily: "monospace", fontSize: 13 }} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Row sizes</span>
          <input type="text" value={rowSizes} onChange={(e) => setRowSizes(e.target.value)}
            style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px", fontFamily: "monospace", fontSize: 13 }} />
        </label>
      </div>

      {/* Items */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button className="btn btn-secondary" onClick={addItem} style={{ fontSize: 13 }}>+ Add Grid Item</button>
        <span style={{ color: "var(--muted)", fontSize: 13, lineHeight: "32px" }}>
          {items.length} positioned items
        </span>
      </div>

      {/* Grid preview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: colSizes,
          gridTemplateRows: rowSizes,
          columnGap: colGap,
          rowGap: rowGap,
          minHeight: 250,
          border: "2px dashed var(--border)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          background: "var(--surface)",
          position: "relative",
        }}
      >
        {/* Empty grid cells as background */}
        {Array.from({ length: columns * rows }).map((_, idx) => (
          <div
            key={`cell-${idx}`}
            style={{
              border: "1px dashed var(--border)",
              borderRadius: 4,
              minHeight: 50,
              opacity: 0.5,
            }}
          />
        ))}
        {/* Positioned items overlay */}
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
            style={{
              position: "absolute",
              gridColumn: `${item.colStart} / ${item.colEnd}`,
              gridRow: `${item.rowStart} / ${item.rowEnd}`,
              background: selectedItem === item.id ? "var(--accent)" : `hsla(${(idx * 67) % 360}, 60%, 55%, 0.8)`,
              color: "#fff",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              padding: 8,
              border: selectedItem === item.id ? "2px solid #fff" : "none",
            }}
          >
            Item {idx + 1}
          </div>
        ))}
      </div>

      {/* Selected item editor */}
      {sel && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Item {items.findIndex((i) => i.id === sel.id) + 1}</span>
            <button className="btn btn-secondary" onClick={() => removeItem(sel.id)} style={{ fontSize: 12 }}>Remove</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            {([["colStart", "Column Start"], ["colEnd", "Column End"], ["rowStart", "Row Start"], ["rowEnd", "Row End"]] as const).map(([field, label]) => (
              <label key={field} style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
                <span style={{ color: "var(--muted)" }}>{label}</span>
                <input type="number" min={1} max={13} value={sel[field]}
                  onChange={(e) => updateItem(sel.id, field, Number(e.target.value))}
                  style={{ background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px", fontFamily: "monospace" }} />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* CSS output */}
      <div style={{
        background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)",
        padding: 16, fontFamily: "monospace", fontSize: 13, whiteSpace: "pre", marginBottom: 12, overflowX: "auto",
      }}>
        {fullCSS}
      </div>

      <button className="btn" onClick={() => copy(fullCSS)}>Copy CSS</button>
      <Toast />
    </main>
  );
}
