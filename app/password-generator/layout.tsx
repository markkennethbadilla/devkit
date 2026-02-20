import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Password Generator — Create Strong Random Passwords | DevKit",
  description:
    "Generate secure random passwords with customizable length and character options. Includes uppercase, lowercase, numbers, and symbols.",
  keywords: [
    "password generator",
    "random password",
    "strong password generator",
    "secure password",
    "password creator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Password Generator"
        description="Generate secure random passwords with customizable length and character options."
        url="https://tools.elunari.uk/password-generator"
      />
      {children}
    </>
  );
}
