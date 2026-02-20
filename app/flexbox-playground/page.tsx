"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const DIRECTIONS = ["row", "row-reverse", "column", "column-reverse"] as const;
const JUSTIFY = ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"] as const;
const ALIGN_ITEMS = ["flex-start", "flex-end", "center", "stretch", "baseline"] as const;
const WRAPS = ["nowrap", "wrap", "wrap-reverse"] as const;
const ALIGN_CONTENT = ["flex-start", "flex-end", "center", "space-between", "space-around", "stretch"] as const;

interface FlexItem {
  id: number;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  alignSelf: string;
  order: number;
}

let nextId = 4;

export default function FlexboxPlaygroundPage() {
  const { copy, Toast } = useCopyToast();

  const [direction, setDirection] = useState<string>("row");
  const [justify, setJustify] = useState<string>("flex-start");
  const [alignItems, setAlignItems] = useState<string>("stretch");
  const [wrap, setWrap] = useState<string>("nowrap");
  const [alignContent, setAlignContent] = useState<string>("stretch");
  const [gap, setGap] = useState(8);

  const [items, setItems] = useState<FlexItem[]>([
    { id: 1, flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", order: 0 },
    { id: 2, flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", order: 0 },
    { id: 3, flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", order: 0 },
  ]);

  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: nextId++, flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", order: 0 },
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItem === id) setSelectedItem(null);
  };

  const updateItem = (id: number, field: keyof Omit<FlexItem, "id">, value: string | number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const containerCSS = useMemo(() => {
    const lines = [
      "display: flex;",
      `flex-direction: ${direction};`,
      `justify-content: ${justify};`,
      `align-items: ${alignItems};`,
      `flex-wrap: ${wrap};`,
    ];
    if (wrap !== "nowrap") lines.push(`align-content: ${alignContent};`);
    if (gap > 0) lines.push(`gap: ${gap}px;`);
    return lines.join("\n");
  }, [direction, justify, alignItems, wrap, alignContent, gap]);

  const selectedItemObj = items.find((i) => i.id === selectedItem);

  const sel = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    options: readonly string[]
  ) => (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
      <span style={{ color: "var(--muted)" }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "var(--surface)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "6px 8px",
          fontSize: 13,
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <main className="tool-container">
      <h1 className="tool-title">CSS Flexbox Playground</h1>
      <p className="tool-desc">
        Experiment with Flexbox properties and see the result in real time. Click items to edit their individual flex properties.
      </p>

      {/* Container controls */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {sel("flex-direction", direction, setDirection, DIRECTIONS)}
        {sel("justify-content", justify, setJustify, JUSTIFY)}
        {sel("align-items", alignItems, setAlignItems, ALIGN_ITEMS)}
        {sel("flex-wrap", wrap, setWrap, WRAPS)}
        {wrap !== "nowrap" && sel("align-content", alignContent, setAlignContent, ALIGN_CONTENT)}
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>gap</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min={0}
              max={40}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontFamily: "monospace", minWidth: 32 }}>{gap}px</span>
          </div>
        </label>
      </div>

      {/* Add/remove items */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button className="btn btn-secondary" onClick={addItem} style={{ fontSize: 13 }}>
          + Add Item
        </button>
        <span style={{ color: "var(--muted)", fontSize: 13, lineHeight: "32px" }}>
          {items.length} items — click an item to edit its flex properties
        </span>
      </div>

      {/* Preview area */}
      <div
        style={{
          display: "flex",
          flexDirection: direction as React.CSSProperties["flexDirection"],
          justifyContent: justify,
          alignItems: alignItems,
          flexWrap: wrap as React.CSSProperties["flexWrap"],
          alignContent: wrap !== "nowrap" ? alignContent : undefined,
          gap: gap,
          minHeight: 200,
          border: "2px dashed var(--border)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          background: "var(--surface)",
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
            style={{
              flexGrow: item.flexGrow,
              flexShrink: item.flexShrink,
              flexBasis: item.flexBasis,
              alignSelf: item.alignSelf !== "auto" ? item.alignSelf : undefined,
              order: item.order,
              minWidth: 50,
              minHeight: 50,
              background:
                selectedItem === item.id
                  ? "var(--accent)"
                  : `hsl(${(index * 47) % 360}, 60%, 55%)`,
              color: "#fff",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              padding: "8px 16px",
              border: selectedItem === item.id ? "2px solid #fff" : "2px solid transparent",
              transition: "all 0.15s",
            }}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {/* Selected item properties */}
      {selectedItemObj && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>
              Item {items.findIndex((i) => i.id === selectedItemObj.id) + 1} Properties
            </span>
            {items.length > 1 && (
              <button
                className="btn btn-secondary"
                onClick={() => removeItem(selectedItemObj.id)}
                style={{ fontSize: 12 }}
              >
                Remove
              </button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>flex-grow</span>
              <input
                type="number"
                min={0}
                max={10}
                value={selectedItemObj.flexGrow}
                onChange={(e) => updateItem(selectedItemObj.id, "flexGrow", Number(e.target.value))}
                style={{
                  background: "var(--background)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "6px 8px",
                  fontFamily: "monospace",
                }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>flex-shrink</span>
              <input
                type="number"
                min={0}
                max={10}
                value={selectedItemObj.flexShrink}
                onChange={(e) => updateItem(selectedItemObj.id, "flexShrink", Number(e.target.value))}
                style={{
                  background: "var(--background)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "6px 8px",
                  fontFamily: "monospace",
                }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>flex-basis</span>
              <input
                type="text"
                value={selectedItemObj.flexBasis}
                onChange={(e) => updateItem(selectedItemObj.id, "flexBasis", e.target.value)}
                style={{
                  background: "var(--background)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "6px 8px",
                  fontFamily: "monospace",
                }}
              />
            </label>
            {sel(
              "align-self",
              selectedItemObj.alignSelf,
              (v) => updateItem(selectedItemObj.id, "alignSelf", v),
              ["auto", ...ALIGN_ITEMS]
            )}
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>order</span>
              <input
                type="number"
                min={-10}
                max={10}
                value={selectedItemObj.order}
                onChange={(e) => updateItem(selectedItemObj.id, "order", Number(e.target.value))}
                style={{
                  background: "var(--background)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "6px 8px",
                  fontFamily: "monospace",
                }}
              />
            </label>
          </div>
        </div>
      )}

      {/* CSS output */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: 8,
          border: "1px solid var(--border)",
          padding: 16,
          fontFamily: "monospace",
          fontSize: 13,
          whiteSpace: "pre",
          marginBottom: 12,
          overflowX: "auto",
        }}
      >
        {containerCSS}
      </div>

      <button className="btn" onClick={() => copy(containerCSS)}>
        Copy CSS
      </button>

      <Toast />
    </main>
  );
}
