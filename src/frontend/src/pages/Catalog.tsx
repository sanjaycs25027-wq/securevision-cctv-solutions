import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";

const PRODUCTS = [
  {
    id: "p1",
    name: "IP Dome Camera 4MP",
    price: 89,
    category: "Cameras",
    desc: "Full HD 4MP indoor/outdoor dome camera with night vision and wide angle lens.",
  },
  {
    id: "p2",
    name: "PTZ Speed Dome Camera",
    price: 245,
    category: "Cameras",
    desc: "Pan-tilt-zoom camera with 30x optical zoom and auto-tracking.",
  },
  {
    id: "p3",
    name: "Night Vision Bullet Camera",
    price: 125,
    category: "Cameras",
    desc: "Long-range IR night vision up to 80m, weatherproof housing.",
  },
  {
    id: "p4",
    name: "Wireless IP Camera",
    price: 155,
    category: "Cameras",
    desc: "Wi-Fi enabled HD camera with two-way audio and mobile alerts.",
  },
  {
    id: "p5",
    name: "DVR 8-Channel Kit",
    price: 320,
    category: "DVR/NVR",
    desc: "8-channel 1080p DVR with 2TB HDD included. Real-time recording.",
  },
  {
    id: "p6",
    name: "NVR 16-Channel System",
    price: 580,
    category: "DVR/NVR",
    desc: "Professional 16-channel 4K NVR with RAID storage support.",
  },
  {
    id: "p7",
    name: "4-Camera Home Kit",
    price: 399,
    category: "Kits",
    desc: "Complete home security kit with 4 cameras, DVR, cables and PSU.",
  },
  {
    id: "p8",
    name: "HDMI Security Cable 20m",
    price: 35,
    category: "Accessories",
    desc: "High-quality shielded coax cable for CCTV systems, 20 meter length.",
  },
  {
    id: "p9",
    name: "Power Adapter 12V",
    price: 22,
    category: "Accessories",
    desc: "Universal 12V power supply for CCTV cameras and accessories.",
  },
  {
    id: "p10",
    name: "Access Control Keypad",
    price: 180,
    category: "Access Control",
    desc: "RFID and PIN keypad with weatherproof housing and relay output.",
  },
  {
    id: "p11",
    name: "Motion Sensor Detector",
    price: 65,
    category: "Accessories",
    desc: "Wide-angle PIR motion detector with adjustable sensitivity.",
  },
  {
    id: "p12",
    name: "IR Illuminator 60m",
    price: 55,
    category: "Accessories",
    desc: "Infrared illuminator extending camera night vision range to 60m.",
  },
];

const CATEGORIES = [
  "All",
  "Cameras",
  "DVR/NVR",
  "Kits",
  "Access Control",
  "Accessories",
];

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { addItem } = useCart();

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddToCart = (p: (typeof PRODUCTS)[0]) => {
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      isService: false,
      category: p.category,
    });
    toast.success(`${p.name} added to cart!`);
  };

  return (
    <div className="py-12 text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#2FA8FF" }}
          >
            Our Products
          </p>
          <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-3">
            EQUIPMENT CATALOG
          </h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#B9C7D9" }}>
            Professional-grade CCTV equipment, DVR/NVR systems, and security
            accessories.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#6F88A3" }}
            />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              style={{
                background: "#0B2440",
                borderColor: "#163A5E",
                color: "white",
              }}
              data-ocid="catalog.search_input"
            />
          </div>
          <div className="flex flex-wrap gap-2" data-ocid="catalog.filter.tab">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="text-xs font-semibold uppercase tracking-wide"
                style={
                  activeCategory === cat
                    ? { background: "#1E7BFF", color: "white" }
                    : {
                        background: "#0B2440",
                        borderColor: "#163A5E",
                        color: "#B9C7D9",
                        border: "1px solid #163A5E",
                      }
                }
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-20"
            data-ocid="catalog.products.empty_state"
          >
            <Camera className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p style={{ color: "#6F88A3" }}>No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, idx) => (
              <div
                key={product.id}
                className="rounded-xl border overflow-hidden transition-all hover:border-blue-500/40"
                style={{ background: "#0B2440", borderColor: "#163A5E" }}
                data-ocid={`catalog.item.${idx + 1}`}
              >
                <div
                  className="h-44 flex items-center justify-center relative"
                  style={{ background: "#071A2F" }}
                >
                  <Camera
                    className="w-16 h-16 opacity-20"
                    style={{ color: "#1E7BFF" }}
                  />
                  <Badge
                    className="absolute top-2 left-2 text-xs"
                    style={{
                      background: "rgba(30,123,255,0.2)",
                      color: "#2FA8FF",
                      border: "1px solid rgba(30,123,255,0.3)",
                    }}
                  >
                    {product.category}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 text-white">
                    {product.name}
                  </h3>
                  <p className="text-xs mb-3" style={{ color: "#6F88A3" }}>
                    {product.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-bold text-lg"
                      style={{ color: "#1E7BFF" }}
                    >
                      ${product.price}
                    </span>
                    <Button
                      size="sm"
                      className="text-xs font-semibold flex items-center gap-1"
                      style={{ background: "#1E7BFF", color: "white" }}
                      onClick={() => handleAddToCart(product)}
                      data-ocid={`catalog.add_to_cart.${idx + 1}`}
                    >
                      <ShoppingCart className="w-3 h-3" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
