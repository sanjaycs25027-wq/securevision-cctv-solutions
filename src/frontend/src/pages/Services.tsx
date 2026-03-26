import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  Camera,
  DoorOpen,
  Home,
  Lock,
  Zap,
} from "lucide-react";

const SERVICES = [
  {
    id: "svc1",
    icon: Home,
    title: "CCTV Home Installation",
    price: "from $150",
    desc: "Complete residential CCTV setup with HD cameras, DVR, remote viewing app, and professional cabling.",
    features: [
      "Up to 8 cameras",
      "Remote mobile viewing",
      "Night vision",
      "1 year warranty",
    ],
    category: "Residential",
  },
  {
    id: "svc2",
    icon: Building2,
    title: "CCTV Commercial Installation",
    price: "from $350",
    desc: "Enterprise-grade surveillance systems for offices, warehouses, retail stores and large premises.",
    features: [
      "Scalable to 64+ cameras",
      "NVR with RAID backup",
      "24/7 monitoring option",
      "Compliance ready",
    ],
    category: "Commercial",
  },
  {
    id: "svc3",
    icon: Zap,
    title: "Smart Home Automation",
    price: "from $500",
    desc: "Integrate your security with smart lighting, locks, thermostats and appliances for a fully connected home.",
    features: [
      "Voice control (Alexa/Google)",
      "Automated routines",
      "Energy saving",
      "Remote control app",
    ],
    category: "Automation",
  },
  {
    id: "svc4",
    icon: Bell,
    title: "Alarm System Setup",
    price: "from $200",
    desc: "Motion-triggered alarm systems with siren, strobe, and optional 24/7 monitoring center connection.",
    features: [
      "PIR & door sensors",
      "Pet-immune options",
      "SMS & push alerts",
      "Battery backup",
    ],
    category: "Security",
  },
  {
    id: "svc5",
    icon: Lock,
    title: "Access Control Setup",
    price: "from $280",
    desc: "Keypad, card reader and biometric access systems to control entry to your building or rooms.",
    features: [
      "RFID & PIN entry",
      "Audit trail logs",
      "Time-zone restrictions",
      "Remote unlock",
    ],
    category: "Access",
  },
  {
    id: "svc6",
    icon: DoorOpen,
    title: "Automation Door Systems",
    price: "from $320",
    desc: "Automatic sliding, swing and barrier gates with access control integration for commercial and residential use.",
    features: [
      "Sliding & swing doors",
      "Vehicle barrier gates",
      "Remote & app control",
      "Safety sensors",
    ],
    category: "Automation",
  },
];

export default function Services() {
  return (
    <div className="py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#2FA8FF" }}
          >
            What We Do
          </p>
          <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-3">
            OUR SERVICES
          </h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#B9C7D9" }}>
            Professional installation and maintenance services from certified
            security technicians.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((svc, idx) => (
            <div
              key={svc.id}
              className="rounded-xl border flex flex-col transition-all hover:border-blue-500/40"
              style={{ background: "#0B2440", borderColor: "#163A5E" }}
              data-ocid={`services.item.${idx + 1}`}
            >
              <div className="p-6 flex-1">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(30,123,255,0.15)" }}
                >
                  <svc.icon className="w-6 h-6" style={{ color: "#1E7BFF" }} />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold uppercase tracking-wide text-sm leading-tight">
                    {svc.title}
                  </h3>
                  <span
                    className="font-bold text-sm ml-2 flex-shrink-0"
                    style={{ color: "#1E7BFF" }}
                  >
                    {svc.price}
                  </span>
                </div>
                <p className="text-xs mb-4" style={{ color: "#B9C7D9" }}>
                  {svc.desc}
                </p>
                <ul className="space-y-1">
                  {svc.features.map((f) => (
                    <li
                      key={f}
                      className="text-xs flex items-center gap-2"
                      style={{ color: "#B9C7D9" }}
                    >
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: "#1E7BFF" }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border-t" style={{ borderColor: "#163A5E" }}>
                <Link to="/book" search={{ service: svc.id }}>
                  <Button
                    className="w-full font-bold uppercase tracking-widest text-xs py-2"
                    style={{ background: "#1E7BFF", color: "white" }}
                    data-ocid={`services.book.${idx + 1}`}
                  >
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Process note */}
        <div
          className="mt-12 rounded-2xl p-8 border text-center"
          style={{ background: "#0B2440", borderColor: "#163A5E" }}
        >
          <h3 className="text-xl font-bold uppercase tracking-wide mb-2">
            Not Sure What You Need?
          </h3>
          <p className="text-sm mb-4" style={{ color: "#B9C7D9" }}>
            Contact our security consultants for a free assessment of your
            property and requirements.
          </p>
          <Link to="/contact">
            <Button
              variant="outline"
              className="font-bold uppercase tracking-widest text-xs border"
              style={{
                borderColor: "#1E7BFF",
                color: "#2FA8FF",
                background: "transparent",
              }}
              data-ocid="services.contact.button"
            >
              Get Free Consultation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
