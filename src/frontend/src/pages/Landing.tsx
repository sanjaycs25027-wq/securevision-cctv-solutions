import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  Home,
  Lock,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";

const FEATURED_PRODUCTS = [
  {
    id: "p1",
    name: "IP Dome Camera 4MP",
    price: 89,
    category: "Cameras",
    badge: "Bestseller",
  },
  {
    id: "p2",
    name: "DVR 8-Channel Kit",
    price: 320,
    category: "DVR/NVR",
    badge: "Popular",
  },
  {
    id: "p3",
    name: "Access Control Keypad",
    price: 180,
    category: "Access Control",
    badge: null,
  },
  {
    id: "p4",
    name: "4-Camera Home Kit",
    price: 399,
    category: "Kits",
    badge: "Bundle",
  },
];

const STEPS = [
  {
    num: "01",
    label: "Consultation",
    desc: "Free assessment of your security needs",
  },
  {
    num: "02",
    label: "Quote",
    desc: "Transparent pricing with no hidden fees",
  },
  {
    num: "03",
    label: "Installation",
    desc: "Professional certified installation",
  },
  {
    num: "04",
    label: "Support",
    desc: "24/7 ongoing monitoring & maintenance",
  },
];

const WHY_US = [
  {
    icon: Shield,
    label: "Reliable Technology",
    desc: "Enterprise-grade equipment built to last",
  },
  {
    icon: Award,
    label: "Certified Pros",
    desc: "Licensed and insured technicians",
  },
  {
    icon: Clock,
    label: "24/7 Support",
    desc: "Round-the-clock monitoring and help",
  },
  {
    icon: Star,
    label: "Premium Business",
    desc: "Dedicated accounts for enterprise clients",
  },
];

export default function Landing() {
  const { addItem } = useCart();

  const handleAddToCart = (product: (typeof FEATURED_PRODUCTS)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      isService: false,
      category: product.category,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="text-white">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #071A2F 0%, #0B2440 50%, #071A2F 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 50%, #1E7BFF 0%, transparent 60%)",
          }}
        />
        <div className="container mx-auto px-4 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge
                className="mb-4 text-xs font-semibold uppercase tracking-widest px-3 py-1"
                style={{
                  background: "rgba(30,123,255,0.15)",
                  color: "#2FA8FF",
                  border: "1px solid rgba(30,123,255,0.3)",
                }}
              >
                Trusted Security Since 2010
              </Badge>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight leading-none mb-6"
                style={{ lineHeight: 1.1 }}
              >
                ADVANCED
                <br />
                <span style={{ color: "#1E7BFF" }}>SECURITY</span>
                <br />
                SOLUTIONS
              </h1>
              <p className="text-lg mb-8 max-w-md" style={{ color: "#B9C7D9" }}>
                Professional CCTV installation, access control, and smart
                automation systems for homes and businesses. Protect what
                matters most.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/catalog">
                  <Button
                    className="font-bold uppercase tracking-widest px-6 py-5 text-sm"
                    style={{ background: "#1E7BFF", color: "white" }}
                    data-ocid="hero.catalog.primary_button"
                  >
                    SHOP CATALOG <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/book">
                  <Button
                    variant="outline"
                    className="font-bold uppercase tracking-widest px-6 py-5 text-sm border"
                    style={{
                      borderColor: "#163A5E",
                      color: "#B9C7D9",
                      background: "transparent",
                    }}
                    data-ocid="hero.book.secondary_button"
                  >
                    BOOK SERVICES
                  </Button>
                </Link>
              </div>
              <div className="flex gap-6 mt-8">
                {[
                  ["500+", "Installations"],
                  ["98%", "Satisfaction"],
                  ["24/7", "Support"],
                ].map(([val, label]) => (
                  <div key={label}>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: "#1E7BFF" }}
                    >
                      {val}
                    </div>
                    <div
                      className="text-xs uppercase tracking-wide"
                      style={{ color: "#6F88A3" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div
                className="relative rounded-2xl overflow-hidden border"
                style={{ borderColor: "#163A5E" }}
              >
                <img
                  src="/assets/generated/hero-cctv.dim_800x500.jpg"
                  alt="CCTV Security System"
                  className="w-full h-72 lg:h-96 object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, #071A2F 0%, transparent 50%)",
                  }}
                />
              </div>
              <div
                className="absolute -bottom-4 -left-4 rounded-xl p-4 border"
                style={{ background: "#0B2440", borderColor: "#163A5E" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#B9C7D9" }}
                  >
                    Live Monitoring Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Services */}
      <section className="py-16" style={{ background: "#061427" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#2FA8FF" }}
            >
              What We Offer
            </p>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight">
              KEY SERVICES
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Camera,
                title: "CCTV Surveillance",
                desc: "Full HD cameras with remote viewing, night vision, and AI motion detection for comprehensive coverage.",
              },
              {
                icon: Lock,
                title: "Access Control",
                desc: "Smart keypads, card readers, and biometric systems to control who enters your premises.",
              },
              {
                icon: Zap,
                title: "Automation Door Systems",
                desc: "Automatic doors, gate systems, and smart access solutions with remote management.",
              },
            ].map((svc) => (
              <div
                key={svc.title}
                className="rounded-xl p-6 border text-center transition-all hover:border-blue-500/50"
                style={{ background: "#0B2440", borderColor: "#163A5E" }}
                data-ocid={`services.${svc.title.toLowerCase().replace(/\s+/g, "_")}.card`}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(30,123,255,0.15)" }}
                >
                  <svc.icon className="w-7 h-7" style={{ color: "#1E7BFF" }} />
                </div>
                <h3 className="font-bold text-lg uppercase tracking-wide mb-2">
                  {svc.title}
                </h3>
                <p className="text-sm" style={{ color: "#B9C7D9" }}>
                  {svc.desc}
                </p>
                <Link to="/services">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "#2FA8FF" }}
                  >
                    Learn More <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#2FA8FF" }}
            >
              Top Picks
            </p>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight">
              FEATURED SOLUTIONS
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_PRODUCTS.map((product, idx) => (
              <div
                key={product.id}
                className="rounded-xl border overflow-hidden transition-all hover:border-blue-500/40"
                style={{ background: "#0B2440", borderColor: "#163A5E" }}
                data-ocid={`products.item.${idx + 1}`}
              >
                <div
                  className="relative h-40 flex items-center justify-center"
                  style={{ background: "#071A2F" }}
                >
                  <Camera
                    className="w-16 h-16 opacity-20"
                    style={{ color: "#1E7BFF" }}
                  />
                  {product.badge && (
                    <Badge
                      className="absolute top-2 right-2 text-xs"
                      style={{ background: "#1E7BFF", color: "white" }}
                    >
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <p
                    className="text-xs uppercase tracking-wide mb-1"
                    style={{ color: "#6F88A3" }}
                  >
                    {product.category}
                  </p>
                  <h4 className="font-semibold text-sm mb-2 text-white">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-bold text-lg"
                      style={{ color: "#1E7BFF" }}
                    >
                      ${product.price}
                    </span>
                    <Button
                      size="sm"
                      className="text-xs font-semibold"
                      style={{ background: "#1E7BFF", color: "white" }}
                      onClick={() => handleAddToCart(product)}
                      data-ocid={`products.add_to_cart.${idx + 1}`}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/catalog">
              <Button
                variant="outline"
                className="font-bold uppercase tracking-widest border"
                style={{
                  borderColor: "#163A5E",
                  color: "#B9C7D9",
                  background: "transparent",
                }}
                data-ocid="products.view_all.button"
              >
                VIEW FULL CATALOG <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process stepper */}
      <section className="py-16" style={{ background: "#061427" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#2FA8FF" }}
            >
              How It Works
            </p>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight">
              OUR PROCESS
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-0 h-px"
                    style={{
                      background:
                        "linear-gradient(to right, #163A5E, transparent)",
                    }}
                  />
                )}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg border-2"
                  style={{
                    background: "rgba(30,123,255,0.1)",
                    borderColor: "#1E7BFF",
                    color: "#1E7BFF",
                  }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold uppercase tracking-wide mb-2 text-white">
                  {step.label}
                </h3>
                <p className="text-sm" style={{ color: "#B9C7D9" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#2FA8FF" }}
            >
              Our Strengths
            </p>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight">
              WHY CHOOSE US
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item) => (
              <div key={item.label} className="text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(30,123,255,0.15)" }}
                >
                  <item.icon className="w-7 h-7" style={{ color: "#2FA8FF" }} />
                </div>
                <h3 className="font-bold uppercase tracking-wide mb-2 text-white">
                  {item.label}
                </h3>
                <p className="text-sm" style={{ color: "#B9C7D9" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Tiles */}
      <section className="py-16" style={{ background: "#061427" }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="rounded-2xl p-8 border relative overflow-hidden"
              style={{ background: "#0B2440", borderColor: "#163A5E" }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                style={{
                  background: "#1E7BFF",
                  transform: "translate(30%, -30%)",
                }}
              />
              <Users className="w-8 h-8 mb-4" style={{ color: "#2FA8FF" }} />
              <h3 className="text-xl font-bold uppercase tracking-wide mb-2">
                FROM THE FORUM
              </h3>
              <p className="text-sm mb-4" style={{ color: "#B9C7D9" }}>
                Join our community of security professionals. Share tips, ask
                questions, get advice from experts.
              </p>
              <Link to="/forum">
                <Button
                  className="font-semibold uppercase tracking-wide text-xs"
                  style={{ background: "#1E7BFF", color: "white" }}
                  data-ocid="forum.cta.button"
                >
                  Join Community <ArrowRight className="ml-2 w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div
              className="rounded-2xl p-8 border relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0B2440, #163A5E)",
                borderColor: "#1E7BFF",
              }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                style={{
                  background: "#2FA8FF",
                  transform: "translate(30%, -30%)",
                }}
              />
              <Star className="w-8 h-8 mb-4" style={{ color: "#FFD700" }} />
              <h3 className="text-xl font-bold uppercase tracking-wide mb-2">
                PREMIUM BUSINESS ACCOUNTS
              </h3>
              <p className="text-sm mb-4" style={{ color: "#B9C7D9" }}>
                Unlock priority support, special pricing, and a dedicated
                account manager for your business.
              </p>
              <Link to="/account">
                <Button
                  className="font-semibold uppercase tracking-wide text-xs"
                  style={{ background: "#1E7BFF", color: "white" }}
                  data-ocid="premium.cta.button"
                >
                  Get Premium <ArrowRight className="ml-2 w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
