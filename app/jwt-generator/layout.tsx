import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Generator – DevKit",
  description:
    "Create signed JSON Web Tokens (JWT) with custom headers, payloads, and HMAC-SHA256 signing. Set expiration, issuer, audience, and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
