import type { Metadata } from "next";
import Link from "next/link";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Heard Hospitality Group",
  description:
    "Privacy Policy for Heard Hospitality Group, including contact forms, catering inquiries, and SMS communications.",
  alternates: {
    canonical: "https://heardhospitalitygroup.com/privacy-policy",
  },
};

const sections = [
  {
    title: "Information We Collect",
    body: [
      "We may collect information you choose to provide when you contact Heard Hospitality Group or one of our brands, including your name, phone number, email address, company, event details, service needs, dietary notes, delivery or event location, and other information related to your inquiry.",
      "If you call, text, email, submit a form, or speak with a receptionist or automated assistant, we may collect conversation details needed to respond to your request and provide follow-up.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use information to respond to inquiries, coordinate catering or meal prep requests, provide quotes or follow-up, support customer service, improve our internal workflows, and maintain business records.",
      "We may use phone numbers and email addresses to follow up about the specific inquiry, request, event, or service conversation you initiated.",
    ],
  },
  {
    title: "SMS Communications",
    body: [
      "If you provide your phone number and consent to receive text messages, we may send SMS messages related to your inquiry, including follow-up confirmations, callback coordination, event or meal prep details, and urgent issue follow-up.",
      "Message frequency varies. Message and data rates may apply. You can opt out of SMS messages at any time by replying STOP. You may reply HELP for assistance.",
      "SMS opt-in data and consent are not sold, rented, or shared with third parties for their marketing purposes.",
    ],
  },
  {
    title: "Sharing Information",
    body: [
      "We do not sell personal information. We may share information with service providers that help us operate our website, communications, scheduling, customer service, hosting, analytics, or business systems, only as needed for those services.",
      "We may also disclose information if required by law, to protect our rights, or to prevent misuse of our services.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "We keep information for as long as reasonably necessary to respond to inquiries, provide services, maintain records, resolve disputes, comply with legal obligations, and support business operations.",
    ],
  },
  {
    title: "Your Choices",
    body: [
      "You may request that we update or delete your contact information by contacting us. You may opt out of SMS messages by replying STOP and may opt out of marketing email messages by using the unsubscribe link if one is provided.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For privacy questions, contact Heard Hospitality Group at info@heardhospitalitygroup.com or 832-510-8440.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-deep-gradient text-foreground">
      <StickyNav />

      <main className="px-6 pb-20 pt-28">
        <article className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Legal
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Privacy Policy
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
            <Link href="/terms-of-service" className="text-primary hover:text-primary/80">
              View Terms of Service
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
