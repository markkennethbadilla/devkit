import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Cron Expression Parser — Generate & Explain Cron Schedules | DevKit",
  description:
    "Parse, generate, and explain cron expressions. See the next scheduled run times and get human-readable descriptions of cron schedules.",
  keywords: [
    "cron expression parser",
    "cron generator",
    "crontab guru",
    "cron schedule",
    "cron expression explained",
    "cron job generator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Cron Expression Parser"
        description="Parse, generate, and explain cron expressions with next run time predictions."
        url="https://tools.elunari.uk/cron-parser"
      />
      {children}
    </>
  );
}
