import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Responsive Design Tester — Preview URLs at Different Screen Sizes | DevKit",
  description:
    "Preview any website at multiple device screen sizes. Test responsive design for mobile, tablet, laptop, and desktop viewports. Free, runs locally.",
  keywords: [
    "responsive design tester",
    "responsive preview",
    "screen size tester",
    "viewport tester",
    "mobile preview",
    "device preview",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Responsive Design Tester"
        description="Preview websites at different screen sizes to test responsive design. Free, runs locally in your browser."
        url="https://tools.elunari.uk/responsive-tester"
      />
      {children}
    </>
  );
}
