import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "JWT Decoder — Decode JSON Web Tokens Online",
  description:
    "Free JWT decoder. Decode and inspect JWT header, payload, and expiration. No server-side processing — your token stays in your browser.",
  keywords: ["jwt decoder", "jwt debugger", "decode jwt", "json web token", "jwt parser", "jwt online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="JWT Decoder"
        description="Free JWT decoder. Decode and inspect JWT header, payload, and expiration. No server-side processing — your token stays in your browser."
        url="/jwt-decoder"
      />
      {children}
    </>
  );
}
