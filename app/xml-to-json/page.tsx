"use client";

import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

// Simple XML parser (no dependencies)
function xmlToJson(xml: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error("Invalid XML: " + errorNode.textContent);
  }

  function nodeToObj(node: Element): unknown {
    const obj: Record<string, unknown> = {};

    // Attributes
    if (node.attributes.length > 0) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        obj["@" + attr.name] = attr.value;
      }
    }

    // Children
    const childElements = Array.from(node.children);
    if (childElements.length === 0) {
      // Text content only
      const text = (node.textContent || "").trim();
      if (Object.keys(obj).length === 0) {
        return text || null;
      }
      if (text) {
        obj["#text"] = text;
      }
      return obj;
    }

    // Group children by tag name
    const groups: Record<string, Element[]> = {};
    for (const child of childElements) {
      const tag = child.tagName;
      if (!groups[tag]) groups[tag] = [];
      groups[tag].push(child);
    }

    for (const [tag, elements] of Object.entries(groups)) {
      if (elements.length === 1) {
        obj[tag] = nodeToObj(elements[0]);
      } else {
        obj[tag] = elements.map(nodeToObj);
      }
    }

    return obj;
  }

  const root = doc.documentElement;
  return { [root.tagName]: nodeToObj(root) };
}

// Simple JSON to XML converter
function jsonToXml(json: unknown, indent: number = 0): string {
  const pad = "  ".repeat(indent);

  if (json === null || json === undefined) return "";
  if (typeof json !== "object") return String(json);

  const lines: string[] = [];

  if (Array.isArray(json)) {
    for (const item of json) {
      lines.push(jsonToXml(item, indent));
    }
    return lines.join("\n");
  }

  const obj = json as Record<string, unknown>;
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("@")) continue; // skip attributes in simple conversion
    if (key === "#text") {
      lines.push(pad + String(value));
      continue;
    }

    // Collect attributes
    const attrs: string[] = [];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const valObj = value as Record<string, unknown>;
      for (const [k, v] of Object.entries(valObj)) {
        if (k.startsWith("@")) {
          attrs.push(` ${k.slice(1)}="${String(v)}"`);
        }
      }
    }

    const attrStr = attrs.join("");

    if (value === null || value === undefined || value === "") {
      lines.push(`${pad}<${key}${attrStr} />`);
    } else if (typeof value !== "object") {
      lines.push(`${pad}<${key}${attrStr}>${String(value)}</${key}>`);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item !== "object" || item === null) {
          lines.push(`${pad}<${key}${attrStr}>${String(item)}</${key}>`);
        } else {
          const inner = jsonToXml(item, indent + 1);
          lines.push(`${pad}<${key}${attrStr}>`);
          lines.push(inner);
          lines.push(`${pad}</${key}>`);
        }
      }
    } else {
      const inner = jsonToXml(value, indent + 1);
      // Check if inner is simple (no newlines)
      if (!inner.includes("\n") && !inner.includes("<")) {
        lines.push(`${pad}<${key}${attrStr}>${inner.trim()}</${key}>`);
      } else {
        lines.push(`${pad}<${key}${attrStr}>`);
        lines.push(inner);
        lines.push(`${pad}</${key}>`);
      }
    }
  }

  return lines.join("\n");
}

const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>10.99</price>
  </book>
  <book category="non-fiction">
    <title lang="en">Sapiens</title>
    <author>Yuval Noah Harari</author>
    <year>2011</year>
    <price>14.99</price>
  </book>
</bookstore>`;

export default function XmlToJsonPage() {
  const [input, setInput] = useState(sampleXml);
  const [mode, setMode] = useState<"xml-to-json" | "json-to-xml">("xml-to-json");
  const { copy, Toast } = useCopyToast();

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      if (mode === "xml-to-json") {
        const result = xmlToJson(input);
        return JSON.stringify(result, null, 2);
      } else {
        const parsed = JSON.parse(input);
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + jsonToXml(parsed);
      }
    } catch (e: unknown) {
      return `Error: ${e instanceof Error ? e.message : "Invalid input"}`;
    }
  }, [input, mode]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">XML to JSON Converter</h1>
      <p className="text-[var(--muted)] mb-6">
        Convert XML to JSON or JSON to XML. Handles attributes, nested elements, and arrays.
      </p>

      <div className="flex gap-2 mb-4">
        <button
          className={mode === "xml-to-json" ? "btn" : "btn-secondary"}
          onClick={() => { setMode("xml-to-json"); setInput(sampleXml); }}
        >
          XML → JSON
        </button>
        <button
          className={mode === "json-to-xml" ? "btn" : "btn-secondary"}
          onClick={() => {
            setMode("json-to-xml");
            setInput('{\n  "person": {\n    "name": "John",\n    "age": 30,\n    "hobbies": {\n      "hobby": ["reading", "coding", "gaming"]\n    }\n  }\n}');
          }}
        >
          JSON → XML
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {mode === "xml-to-json" ? "XML Input" : "JSON Input"}
          </label>
          <textarea
            className="w-full h-72 rounded bg-[var(--card)] border border-[var(--border)] p-3 font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "xml-to-json" ? "Paste XML here..." : "Paste JSON here..."}
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {mode === "xml-to-json" ? "JSON Output" : "XML Output"}
          </label>
          <textarea
            className="w-full h-72 rounded bg-[var(--card)] border border-[var(--border)] p-3 font-mono text-sm"
            value={output}
            readOnly
            placeholder="Output will appear here..."
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn" onClick={() => copy(output)}>
          Copy Output
        </button>
        <button className="btn-secondary" onClick={() => setInput("")}>
          Clear
        </button>
      </div>

      <Toast />
    </main>
  );
}
