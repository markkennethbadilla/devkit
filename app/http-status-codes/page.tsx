"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface StatusCode {
  code: number;
  name: string;
  desc: string;
  category: string;
}

const STATUS_CODES: StatusCode[] = [
  // 1xx Informational
  { code: 100, name: "Continue", desc: "Server received request headers, client should proceed to send body.", category: "1xx" },
  { code: 101, name: "Switching Protocols", desc: "Server is switching protocols as requested by the client.", category: "1xx" },
  { code: 102, name: "Processing", desc: "Server has received and is processing the request (WebDAV).", category: "1xx" },
  { code: 103, name: "Early Hints", desc: "Used to return some response headers before final HTTP message.", category: "1xx" },
  // 2xx Success
  { code: 200, name: "OK", desc: "Request succeeded. Standard response for successful HTTP requests.", category: "2xx" },
  { code: 201, name: "Created", desc: "Request succeeded and a new resource was created.", category: "2xx" },
  { code: 202, name: "Accepted", desc: "Request accepted for processing, but processing is not complete.", category: "2xx" },
  { code: 203, name: "Non-Authoritative Information", desc: "Request succeeded but returned modified third-party information.", category: "2xx" },
  { code: 204, name: "No Content", desc: "Request succeeded but there is no content to send.", category: "2xx" },
  { code: 205, name: "Reset Content", desc: "Request succeeded, client should reset the document view.", category: "2xx" },
  { code: 206, name: "Partial Content", desc: "Server delivered only part of the resource (Range header).", category: "2xx" },
  { code: 207, name: "Multi-Status", desc: "Conveys information about multiple resources (WebDAV).", category: "2xx" },
  { code: 208, name: "Already Reported", desc: "Members already enumerated in a prior response (WebDAV).", category: "2xx" },
  { code: 226, name: "IM Used", desc: "Server fulfilled a GET request with instance-manipulations.", category: "2xx" },
  // 3xx Redirection
  { code: 300, name: "Multiple Choices", desc: "Multiple options for the resource. Client should choose one.", category: "3xx" },
  { code: 301, name: "Moved Permanently", desc: "Resource permanently moved to a new URL. Update bookmarks.", category: "3xx" },
  { code: 302, name: "Found", desc: "Resource temporarily at a different URL. Keep using original URL.", category: "3xx" },
  { code: 303, name: "See Other", desc: "Response can be found at a different URL using GET.", category: "3xx" },
  { code: 304, name: "Not Modified", desc: "Resource not modified since last request. Use cached version.", category: "3xx" },
  { code: 307, name: "Temporary Redirect", desc: "Resource temporarily at different URL. Same method must be used.", category: "3xx" },
  { code: 308, name: "Permanent Redirect", desc: "Resource permanently at new URL. Same method must be used.", category: "3xx" },
  // 4xx Client Error
  { code: 400, name: "Bad Request", desc: "Server cannot process the request due to client error (malformed syntax).", category: "4xx" },
  { code: 401, name: "Unauthorized", desc: "Authentication required. Client must authenticate to get response.", category: "4xx" },
  { code: 402, name: "Payment Required", desc: "Reserved for future use. Sometimes used for digital payment systems.", category: "4xx" },
  { code: 403, name: "Forbidden", desc: "Client authenticated but does not have permission to access resource.", category: "4xx" },
  { code: 404, name: "Not Found", desc: "Server cannot find the requested resource. URL is not recognized.", category: "4xx" },
  { code: 405, name: "Method Not Allowed", desc: "Request method is known but not supported for the resource.", category: "4xx" },
  { code: 406, name: "Not Acceptable", desc: "No content matching Accept headers found.", category: "4xx" },
  { code: 407, name: "Proxy Authentication Required", desc: "Authentication with a proxy is required.", category: "4xx" },
  { code: 408, name: "Request Timeout", desc: "Server timed out waiting for the request.", category: "4xx" },
  { code: 409, name: "Conflict", desc: "Request conflicts with the current state of the server.", category: "4xx" },
  { code: 410, name: "Gone", desc: "Resource is no longer available and will not be available again.", category: "4xx" },
  { code: 411, name: "Length Required", desc: "Content-Length header is required but not provided.", category: "4xx" },
  { code: 412, name: "Precondition Failed", desc: "Server does not meet one of the preconditions in the request.", category: "4xx" },
  { code: 413, name: "Payload Too Large", desc: "Request entity is larger than the server is willing to process.", category: "4xx" },
  { code: 414, name: "URI Too Long", desc: "The URI requested is longer than the server is willing to interpret.", category: "4xx" },
  { code: 415, name: "Unsupported Media Type", desc: "Media format of the requested data is not supported.", category: "4xx" },
  { code: 416, name: "Range Not Satisfiable", desc: "The range specified in the Range header cannot be fulfilled.", category: "4xx" },
  { code: 417, name: "Expectation Failed", desc: "Expectation indicated by the Expect header cannot be met.", category: "4xx" },
  { code: 418, name: "I'm a Teapot", desc: "The server refuses to brew coffee because it is a teapot (RFC 2324).", category: "4xx" },
  { code: 422, name: "Unprocessable Entity", desc: "Request is well-formed but unable to be processed (validation errors).", category: "4xx" },
  { code: 423, name: "Locked", desc: "The resource being accessed is locked (WebDAV).", category: "4xx" },
  { code: 424, name: "Failed Dependency", desc: "Request failed because it depended on another request (WebDAV).", category: "4xx" },
  { code: 425, name: "Too Early", desc: "Server is unwilling to risk processing a request that might be replayed.", category: "4xx" },
  { code: 426, name: "Upgrade Required", desc: "Client should switch to a different protocol.", category: "4xx" },
  { code: 428, name: "Precondition Required", desc: "Origin server requires the request to be conditional.", category: "4xx" },
  { code: 429, name: "Too Many Requests", desc: "User has sent too many requests in a given amount of time (rate limiting).", category: "4xx" },
  { code: 431, name: "Request Header Fields Too Large", desc: "Server refuses to process because header fields are too large.", category: "4xx" },
  { code: 451, name: "Unavailable For Legal Reasons", desc: "Resource unavailable due to legal demands (censorship, DMCA).", category: "4xx" },
  // 5xx Server Error
  { code: 500, name: "Internal Server Error", desc: "Server encountered an unexpected condition preventing it from fulfilling the request.", category: "5xx" },
  { code: 501, name: "Not Implemented", desc: "Server does not support the functionality required to fulfill the request.", category: "5xx" },
  { code: 502, name: "Bad Gateway", desc: "Server acting as gateway received an invalid response from upstream.", category: "5xx" },
  { code: 503, name: "Service Unavailable", desc: "Server is not ready to handle the request (maintenance or overload).", category: "5xx" },
  { code: 504, name: "Gateway Timeout", desc: "Server acting as gateway did not get a response in time.", category: "5xx" },
  { code: 505, name: "HTTP Version Not Supported", desc: "HTTP version used in the request is not supported.", category: "5xx" },
  { code: 506, name: "Variant Also Negotiates", desc: "Internal configuration error in transparent content negotiation.", category: "5xx" },
  { code: 507, name: "Insufficient Storage", desc: "Server unable to store the representation needed (WebDAV).", category: "5xx" },
  { code: 508, name: "Loop Detected", desc: "Server detected an infinite loop while processing (WebDAV).", category: "5xx" },
  { code: 510, name: "Not Extended", desc: "Further extensions to the request are required.", category: "5xx" },
  { code: 511, name: "Network Authentication Required", desc: "Client needs to authenticate to gain network access (captive portal).", category: "5xx" },
];

const CATEGORIES = [
  { id: "all", label: "All", color: "" },
  { id: "1xx", label: "1xx Info", color: "#60a5fa" },
  { id: "2xx", label: "2xx Success", color: "#22c55e" },
  { id: "3xx", label: "3xx Redirect", color: "#eab308" },
  { id: "4xx", label: "4xx Client Error", color: "#f97316" },
  { id: "5xx", label: "5xx Server Error", color: "#ef4444" },
];

function getCategoryColor(category: string): string {
  return CATEGORIES.find((c) => c.id === category)?.color || "#888";
}

export default function HttpStatusCodes() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { copy, Toast } = useCopyToast();

  const filtered = useMemo(() => {
    return STATUS_CODES.filter((sc) => {
      const matchCategory =
        activeCategory === "all" || sc.category === activeCategory;
      const matchSearch =
        !search ||
        sc.code.toString().includes(search) ||
        sc.name.toLowerCase().includes(search.toLowerCase()) ||
        sc.desc.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">HTTP Status Codes</h1>
      <p className="text-[var(--muted)] mb-6">
        Complete reference of HTTP response status codes. Search by code number,
        name, or description.
      </p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search status codes... (e.g., 404, not found, timeout)"
        className="mb-4"
        spellCheck={false}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={activeCategory === cat.id ? "btn" : "btn-secondary"}
            style={
              activeCategory === cat.id && cat.color
                ? { backgroundColor: cat.color, borderColor: cat.color }
                : {}
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="text-xs text-[var(--muted)] mb-3">
        Showing {filtered.length} of {STATUS_CODES.length} status codes
      </div>

      <div className="space-y-2">
        {filtered.map((sc) => (
          <button
            key={sc.code}
            onClick={() => copy(`${sc.code} ${sc.name}`)}
            className="w-full text-left p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors cursor-pointer flex gap-3 items-start"
          >
            <span
              className="font-mono text-lg font-bold shrink-0 w-12"
              style={{ color: getCategoryColor(sc.category) }}
            >
              {sc.code}
            </span>
            <div className="min-w-0">
              <div className="font-medium text-sm">{sc.name}</div>
              <div className="text-xs text-[var(--muted)]">{sc.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <Toast />
    </div>
  );
}
