import type { Metadata } from "next";
import Link from "next/link";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Heard Hospitality Group",
  description:
    "Terms of Service for Heard Hospitality Group, including inquiry follow-up and SMS messaging terms.",
  alternates: {
    canonical: "https://heardhospitalitygroup.com/terms-of-service",
  },
};

const sections = [
  {
    title: "Use of This Website",
    body: [
      "This website provides information about Heard Hospitality Group, its brands, services, tools, and related business operations. By using this website or contacting us through it, you agree to use it lawfully and not interfere with its operation.",
    ],
  },
  {
    title: "Inquiries and Follow-Up",
    body: [
      "Submitting an inquiry, calling, texting, or speaking with a receptionist or automated assistant does not create a binding service agreement, reservation, catering order, or confirmed event date.",
      "Pricing, availability, menu details, substitutions, deposits, cancellations, refunds, and contract terms must be confirmed directly by an authorized representative of Heard Hospitality Group or the applicable brand.",
    ],
  },
  {
    title: "SMS Terms",
    body: [
      "By providing your phone number and verbally or otherwise consenting to SMS follow-up, you agree to receive text messages from Heard Hospitality Group or its brands related to your inquiry, event, meal prep request, callback coordination, customer service, or urgent issue follow-up.",
      "Message frequency varies based on your inquiry and communication needs. Message and data rates may apply. Reply STOP to opt out of SMS messages. Reply HELP for assistance.",
      "Consent to receive SMS messages is not a condition of purchase. SMS opt-in data and consent are not sold or shared with third parties for their marketing purposes.",
    ],
  },
  {
    title: "No Professional Advice",
    body: [
      "Information on this website is provided for general business and service information only. It is not legal, financial, health, or safety advice.",
    ],
  },
  {
    title: "Intellectual Property",
    body: [
      "Website content, branding, copy, graphics, tools, and other materials are owned by Heard Hospitality Group or used with permission. You may not copy, reproduce, or use them for commercial purposes without written permission.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "We may use third-party services for hosting, communications, analytics, payment, scheduling, customer support, automation, or business operations. Those services may have their own terms and policies.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, Heard Hospitality Group is not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the website or communications with us.",
    ],
  },
  {
    title: "Changes to These Terms",
    body: [
      "We may update these terms from time to time. Updates will be posted on this page with a revised effective date.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For questions about these terms, contact Heard Hospitality Group at info@heardhospitalitygroup.com or 832-510-8440.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-deep-gradient text-foreground">
      <StickyNav />

      <main className="px-6 pb-20 pt-28">
        <article className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Legal
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Terms of Service
          </h1>
          <p className="mb-12 text-sm text-muted-foreground">
            Effective date: May 10, 2026
          </p>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 text-xl font-semibold text-foreground">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
            <Link href="/privacy-policy" className="text-primary hover:text-primary/80">
              View Privacy Policy
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
