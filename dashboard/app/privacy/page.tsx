import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy – Shop the Frame",
  description: "Privacy policy for the Shop the Frame Chrome extension.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8eaff] via-[#f0f2ff] to-[#fef3f3] font-sans">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-700 font-medium mb-10 hover:bg-white transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 mb-10">
          Last updated: April 28, 2026
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            1. Overview
          </h2>
          <p className="text-slate-600 leading-7">
            Shop the Frame (&quot;the Extension&quot;) is a Chrome extension that helps you
            discover and shop products you see in YouTube videos. When you pause a
            video, the Extension captures a still image of the current frame,
            analyzes it using our backend service, and surfaces shoppable products
            matching items visible in the frame.
          </p>
          <p className="text-slate-600 leading-7 mt-3">
            We are committed to protecting your privacy. This policy describes
            exactly what data the Extension collects, how it is used, and with whom
            it is shared, in accordance with the{" "}
            <a
              href="https://developer.chrome.com/docs/webstore/program-policies/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6B7FED] underline underline-offset-2 hover:text-[#8A9AFF]"
            >
              Chrome Web Store Developer Program Policies
            </a>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            2. Data We Collect
          </h2>

          <h3 className="text-base font-semibold text-slate-800 mt-5 mb-2">
            2a. Video Frame Images
          </h3>
          <p className="text-slate-600 leading-7">
            When you pause a YouTube video (or click &quot;Shop this frame&quot;), the
            Extension captures a JPEG screenshot of that video frame from the
            HTML5 video element on your screen. This image is sent to our backend
            API solely to identify items visible in the frame and retrieve matching
            products. Frame images are processed transiently and are not stored
            permanently on our servers.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-5 mb-2">
            2b. Product Click Events
          </h3>
          <p className="text-slate-600 leading-7">
            When you click on a product shown by the Extension, we send a minimal
            analytics event to our backend containing only the product ID and the
            destination product URL. This is used to understand which products are
            most relevant to users and to improve search quality. No personal
            identifiers are attached to these events.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-5 mb-2">
            2c. Extension Settings (Stored Locally)
          </h3>
          <p className="text-slate-600 leading-7">
            Your preferences — whether the Extension is enabled and your preferred
            product marketplace (Shopify or Amazon) — are stored locally on your
            device using{" "}
            <code className="text-sm bg-white/70 px-1 py-0.5 rounded">
              chrome.storage.local
            </code>
            . These settings never leave your device and are never transmitted to
            our servers.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            3. Data We Do Not Collect
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-7">
            <li>We do not collect your name, email address, or any other personally identifiable information.</li>
            <li>We do not collect your browsing history outside of YouTube watch pages.</li>
            <li>We do not collect information about YouTube videos you watch without pausing or triggering the Extension.</li>
            <li>We do not use cookies or cross-site tracking technologies.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            4. How We Use Your Data
          </h2>
          <p className="text-slate-600 leading-7">
            The data described above is used exclusively to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-7 mt-3">
            <li>
              <strong className="text-slate-800">Identify items in video frames</strong> — frame images are
              analyzed by our AI service to detect objects and generate product
              search queries.
            </li>
            <li>
              <strong className="text-slate-800">Return shoppable product results</strong> — search queries are
              sent to Shopify and/or Amazon marketplaces to find matching products
              to display to you.
            </li>
            <li>
              <strong className="text-slate-800">Improve relevance</strong> — anonymous product click events help
              us understand which results are most useful.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            5. Data Sharing and Third Parties
          </h2>
          <p className="text-slate-600 leading-7">
            We do not sell, rent, or share your personal data with third parties for
            their own marketing or advertising purposes.
          </p>
          <p className="text-slate-600 leading-7 mt-3">
            To operate the Extension, we interact with the following third-party
            services:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-7 mt-3">
            <li>
              <strong className="text-slate-800">Shopify Storefront API</strong> — product search queries (text
              strings, not images or personal data) may be sent to Shopify to
              retrieve matching products. Shopify&apos;s use of this data is governed by
              the{" "}
              <a
                href="https://www.shopify.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B7FED] underline underline-offset-2 hover:text-[#8A9AFF]"
              >
                Shopify Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong className="text-slate-800">Amazon Product Advertising API</strong> — if you select Amazon
              as your marketplace, product search queries may be sent to Amazon.
              Amazon&apos;s use of this data is governed by the{" "}
              <a
                href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B7FED] underline underline-offset-2 hover:text-[#8A9AFF]"
              >
                Amazon Privacy Notice
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            6. Data Retention
          </h2>
          <p className="text-slate-600 leading-7">
            Frame images are processed in memory and are not persisted beyond the
            duration of the API request. Anonymous click events are retained in
            aggregate form for product relevance analysis. Your locally stored
            settings persist on your device until you uninstall the Extension or
            clear Chrome extension data.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            7. Permissions
          </h2>
          <p className="text-slate-600 leading-7">
            The Extension requests the following Chrome permissions:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-7 mt-3">
            <li>
              <strong className="text-slate-800">storage</strong> — to save your Extension preferences
              (enabled/disabled, product marketplace) locally on your device.
            </li>
            <li>
              <strong className="text-slate-800">Host permission: youtube.com</strong> — to inject the shopping
              panel into YouTube watch pages so you can interact with the Extension
              while watching videos.
            </li>
          </ul>
          <p className="text-slate-600 leading-7 mt-3">
            No other browser permissions are requested. The Extension does not
            access your camera, microphone, location, bookmarks, or any other
            browser data.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            8. Children&apos;s Privacy
          </h2>
          <p className="text-slate-600 leading-7">
            The Extension is not directed at children under the age of 13. We do
            not knowingly collect any information from children.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            9. Changes to This Policy
          </h2>
          <p className="text-slate-600 leading-7">
            We may update this privacy policy from time to time. Any changes will
            be reflected with an updated &quot;Last updated&quot; date at the top of this
            page. Continued use of the Extension after changes constitutes
            acceptance of the revised policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            10. Contact
          </h2>
          <p className="text-slate-600 leading-7">
            If you have questions or concerns about this privacy policy, please
            open an issue or reach out through the Extension&apos;s Chrome Web Store
            listing.
          </p>
        </section>
      </main>
    </div>
  );
}
