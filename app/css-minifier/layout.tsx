import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "CSS Minifier / Beautifier - DevKit",
  description:
    "Compress CSS to reduce file size or format minified CSS for readability. Free online CSS minifier and beautifier.",
  keywords: ["css minifier", "minify css online", "css beautifier", "css formatter", "compress css"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="CSS Minifier / Beautifier"
        description="Compress CSS to reduce file size or format minified CSS for readability. Free online CSS minifier and beautifier."
        url="/css-minifier"
      />
      {children}
    </>
  );
}
