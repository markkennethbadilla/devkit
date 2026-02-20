import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for DevKit developer tools.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto prose prose-invert">
      <h1>Privacy Policy</h1>
      <p className="text-[var(--muted)]">Last updated: February 20, 2026</p>

      <h2>Overview</h2>
      <p>
        DevKit is a collection of free, client-side developer tools. Your
        privacy is important to us. This policy explains what data we collect
        and how we use it.
      </p>

      <h2>Data Collection</h2>
      <p>
        <strong>We do not collect personal data.</strong> All tools run entirely
        in your browser. No data you enter into any tool is sent to our servers
        or stored anywhere.
      </p>

      <h2>Analytics</h2>
      <p>
        We use Vercel Analytics to collect anonymous, aggregated usage data such
        as page views and visit counts. This data contains no personally
        identifiable information and is used solely to understand which tools
        are most useful.
      </p>

      <h2>Cookies</h2>
      <p>
        DevKit does not set any cookies. Third-party services (such as
        analytics or future advertising partners) may set their own cookies
        subject to their respective privacy policies.
      </p>

      <h2>Advertising</h2>
      <p>
        We may display advertisements through Google AdSense or similar
        services in the future. These services may use cookies and similar
        technologies to serve relevant ads. You can opt out of personalized
        advertising at{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:underline"
        >
          Google Ad Settings
        </a>
        .
      </p>

      <h2>Third-Party Links</h2>
      <p>
        Our site may contain links to external websites. We are not responsible
        for the privacy practices of other sites.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy from time to time. Changes will be posted on
        this page with an updated date.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about this privacy policy, you can reach us
        through our{" "}
        <a
          href="https://github.com/markkennethbadilla"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:underline"
        >
          GitHub profile
        </a>
        .
      </p>
    </div>
  );
}
