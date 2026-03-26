import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Shield,
  Twitter,
  Youtube,
} from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);

  return (
    <footer
      className="border-t"
      style={{ background: "#071A2F", borderColor: "#163A5E" }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "#1E7BFF" }}
              >
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">SecureVision</span>
            </div>
            <p className="text-sm mb-4" style={{ color: "#B9C7D9" }}>
              Professional CCTV & security solutions for homes and businesses.
              Expert installation, maintenance and automation services.
            </p>
            <div className="space-y-2">
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "#B9C7D9" }}
              >
                <MapPin
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#1E7BFF" }}
                />
                <span>123 Security Ave, Tech District, CA 94105</span>
              </div>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "#B9C7D9" }}
              >
                <Phone
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#1E7BFF" }}
                />
                <span>+1 (800) 555-SECURE</span>
              </div>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "#B9C7D9" }}
              >
                <Mail
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#1E7BFF" }}
                />
                <span>info@securevision.com</span>
              </div>
            </div>
            {/* Social */}
            <div className="flex gap-3 mt-4">
              {[
                { k: "fb", Icon: Facebook },
                { k: "tw", Icon: Twitter },
                { k: "li", Icon: Linkedin },
                { k: "yt", Icon: Youtube },
              ].map(({ k, Icon }) => (
                <a
                  key={k}
                  href="/"
                  rel="noopener"
                  className="w-8 h-8 rounded flex items-center justify-center border transition-colors hover:border-brand-blue"
                  style={{ borderColor: "#163A5E", color: "#6F88A3" }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4
              className="font-bold uppercase tracking-widest text-xs mb-4"
              style={{ color: "#2FA8FF" }}
            >
              Company
            </h4>
            <ul className="space-y-2">
              {["About Us", "Our Team", "Careers", "News", "Partners"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="/"
                      rel="noopener"
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: "#B9C7D9" }}
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4
              className="font-bold uppercase tracking-widest text-xs mb-4"
              style={{ color: "#2FA8FF" }}
            >
              Solutions
            </h4>
            <ul className="space-y-2">
              {[
                "CCTV Systems",
                "Access Control",
                "Smart Automation",
                "Door Systems",
                "Alarm Systems",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="/"
                    rel="noopener"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#B9C7D9" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              className="font-bold uppercase tracking-widest text-xs mb-4"
              style={{ color: "#2FA8FF" }}
            >
              Newsletter
            </h4>
            <p className="text-sm mb-3" style={{ color: "#B9C7D9" }}>
              Get security tips and product updates.
            </p>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Your email"
                type="email"
                className="text-sm"
                style={{
                  background: "#0B2440",
                  borderColor: "#163A5E",
                  color: "white",
                }}
              />
              <Button
                size="sm"
                className="font-semibold uppercase tracking-wide text-xs"
                style={{ background: "#1E7BFF", color: "white" }}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div
          className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderColor: "#163A5E" }}
        >
          <p className="text-xs" style={{ color: "#6F88A3" }}>
            © {year} SecureVision. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#6F88A3" }}>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
              className="hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2FA8FF" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
