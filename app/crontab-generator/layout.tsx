import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Crontab Generator – DevKit",
  description: "Build cron schedule expressions visually. Select minute, hour, day, month, and weekday with a friendly interface.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
