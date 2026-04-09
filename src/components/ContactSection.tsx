"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://hook.us2.make.com/5cvh24j98rp32txtb9vweps8ja4ps3o2";

const interestOptions = [
  "Infrastructure Review",
  "Heard OS",
  "Catering Revenue Architecture",
  "AI Visibility",
  "Retention Infrastructure",
  "Operational Control",
];

export default function ContactSection() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    business: "",
    monthlyRevenue: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  const handleChange = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.interest || !form.monthlyRevenue) return;
    setLoading(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // silent — webhook may not be configured yet
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <span className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Contact
        </span>

        {/* Direct access buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button asChild variant="outline" size="lg">
            <a href="sms:+18325108440">Text Us</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="mailto:info@heardhospitalitygroup.com">Email Us</a>
          </Button>
        </div>

        <div className="mb-2">
          <a
            href="mailto:info@heardhospitalitygroup.com"
            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            info@heardhospitalitygroup.com
          </a>
          <a
            href="tel:+18325108440"
            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            832-510-8440
          </a>
        </div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 mb-12">
          Text is fastest.
        </p>

        {/* Contact Form */}
        {submitted ? (
          <div className="border border-border rounded-lg p-8 max-w-xl">
            <p className="text-sm text-foreground font-medium">Received.</p>
            <p className="text-sm text-muted-foreground mt-1">
              You'll get a reply within 1 business day.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="c-name" className="text-xs text-muted-foreground">Name *</Label>
                <Input
                  id="c-name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-biz" className="text-xs text-muted-foreground">Business Name</Label>
                <Input
                  id="c-biz"
                  value={form.business}
                  onChange={(e) => handleChange("business", e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Current Monthly Revenue *</Label>
              <Select
                value={form.monthlyRevenue}
                onValueChange={(v) => handleChange("monthlyRevenue", v)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select monthly revenue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under $25,000">Under $25,000</SelectItem>
                  <SelectItem value="$25,000–$75,000">$25,000–$75,000</SelectItem>
                  <SelectItem value="$75,000+">$75,000+</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                Designed for independent operators serious about stabilizing cash flow.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="c-email" className="text-xs text-muted-foreground">Email *</Label>
                <Input
                  id="c-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  maxLength={255}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-phone" className="text-xs text-muted-foreground">Phone</Label>
                <Input
                  id="c-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  maxLength={20}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Interest *</Label>
              <Select
                value={form.interest}
                onValueChange={(v) => handleChange("interest", v)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select area of interest" />
                </SelectTrigger>
                <SelectContent>
                  {interestOptions.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="c-msg" className="text-xs text-muted-foreground">Message</Label>
              <Textarea
                id="c-msg"
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                maxLength={1000}
                rows={4}
              />
            </div>

            <Button type="submit" disabled={loading} size="lg">
              {loading ? "Sending..." : "Submit"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
