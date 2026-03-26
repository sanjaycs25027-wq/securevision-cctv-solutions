import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddContactMessage } from "../hooks/useQueries";

export default function Contact() {
  const addMessage = useAddContactMessage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const set = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMessage.mutateAsync(form);
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#2FA8FF" }}
          >
            Get In Touch
          </p>
          <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-3">
            CONTACT US
          </h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#B9C7D9" }}>
            Our team is ready to help you find the right security solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl border p-8"
              style={{ background: "#0B2440", borderColor: "#163A5E" }}
            >
              {submitted ? (
                <div
                  className="text-center py-10"
                  data-ocid="contact.success_state"
                >
                  <CheckCircle
                    className="w-14 h-14 mx-auto mb-4"
                    style={{ color: "#1E7BFF" }}
                  />
                  <h3 className="text-xl font-bold uppercase mb-2">
                    Message Sent!
                  </h3>
                  <p style={{ color: "#B9C7D9" }}>
                    We'll respond within 24 hours.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", phone: "", message: "" });
                    }}
                    style={{ background: "#1E7BFF", color: "white" }}
                  >
                    Send Another
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  data-ocid="contact.form"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                        style={{ color: "#B9C7D9" }}
                      >
                        Full Name *
                      </Label>
                      <Input
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        required
                        placeholder="John Smith"
                        style={{
                          background: "#071A2F",
                          borderColor: "#163A5E",
                          color: "white",
                        }}
                        data-ocid="contact.name.input"
                      />
                    </div>
                    <div>
                      <Label
                        className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                        style={{ color: "#B9C7D9" }}
                      >
                        Email *
                      </Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        required
                        placeholder="john@example.com"
                        style={{
                          background: "#071A2F",
                          borderColor: "#163A5E",
                          color: "white",
                        }}
                        data-ocid="contact.email.input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                      style={{ color: "#B9C7D9" }}
                    >
                      Phone
                    </Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+1 234 567 8900"
                      style={{
                        background: "#071A2F",
                        borderColor: "#163A5E",
                        color: "white",
                      }}
                      data-ocid="contact.phone.input"
                    />
                  </div>
                  <div>
                    <Label
                      className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                      style={{ color: "#B9C7D9" }}
                    >
                      Message *
                    </Label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      required
                      placeholder="Tell us about your security needs..."
                      rows={5}
                      style={{
                        background: "#071A2F",
                        borderColor: "#163A5E",
                        color: "white",
                      }}
                      data-ocid="contact.message.textarea"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full font-bold uppercase tracking-widest py-5"
                    disabled={addMessage.isPending}
                    style={{ background: "#1E7BFF", color: "white" }}
                    data-ocid="contact.submit.button"
                  >
                    {addMessage.isPending ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                        Sending...
                      </>
                    ) : (
                      "SEND MESSAGE"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            {[
              {
                icon: MapPin,
                label: "Our Address",
                value: "123 Security Ave, Tech District, CA 94105",
              },
              { icon: Phone, label: "Phone", value: "+1 (800) 555-SECURE" },
              { icon: Mail, label: "Email", value: "info@securevision.com" },
              {
                icon: Clock,
                label: "Working Hours",
                value: "Mon–Fri: 8am–6pm\nSat: 9am–3pm",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border p-5 flex gap-4"
                style={{ background: "#0B2440", borderColor: "#163A5E" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(30,123,255,0.15)" }}
                >
                  <item.icon className="w-5 h-5" style={{ color: "#1E7BFF" }} />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: "#6F88A3" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-sm whitespace-pre-line"
                    style={{ color: "#B9C7D9" }}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
