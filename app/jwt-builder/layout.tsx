import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "JWT Builder — Create JSON Web Tokens Online | DevKit",
  description:
    "Build JSON Web Tokens (JWT) by selecting claims, algorithm, and signing key. Preview header, payload, and encoded token. Free, runs locally in your browser.",
  keywords: [
    "jwt builder",
    "create jwt online",
    "json web token generator",
    "jwt creator",
    "jwt tool",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="JWT Builder"
        description="Build JSON Web Tokens by selecting claims, algorithm, and signing. Free, runs locally."
        url="https://tools.elunari.uk/jwt-builder"
      />
      {children}
    </>
  );
}
