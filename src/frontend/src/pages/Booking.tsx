import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBookService } from "../hooks/useQueries";

const SERVICE_OPTIONS = [
  { id: "svc1", label: "CCTV Home Installation" },
  { id: "svc2", label: "CCTV Commercial Installation" },
  { id: "svc3", label: "Smart Home Automation" },
  { id: "svc4", label: "Alarm System Setup" },
  { id: "svc5", label: "Access Control Setup" },
  { id: "svc6", label: "Automation Door Systems" },
];

export default function Booking() {
  const bookService = useBookService();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    serviceId: "",
    address: "",
    notes: "",
  });
  const [date, setDate] = useState<Date | undefined>();
  const [calOpen, setCalOpen] = useState(false);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please select a preferred date.");
      return;
    }
    try {
      await bookService.mutateAsync({
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        serviceId: form.serviceId,
        address: form.address,
        notes: form.notes,
        status: "pending",
        scheduledDate: BigInt(date.getTime()),
      });
      setSubmitted(true);
      toast.success("Booking submitted successfully!");
    } catch {
      toast.error("Failed to submit booking. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="py-20 text-center text-white">
        <CheckCircle
          className="w-16 h-16 mx-auto mb-4"
          style={{ color: "#1E7BFF" }}
        />
        <h2 className="text-3xl font-bold uppercase mb-2">
          Booking Submitted!
        </h2>
        <p className="mb-6" style={{ color: "#B9C7D9" }}>
          Our team will contact you within 24 hours to confirm your appointment.
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          style={{ background: "#1E7BFF", color: "white" }}
          data-ocid="booking.new.button"
        >
          Submit Another Booking
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12 text-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#2FA8FF" }}
          >
            Schedule a Visit
          </p>
          <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-3">
            BOOK A SERVICE
          </h1>
          <p className="text-sm" style={{ color: "#B9C7D9" }}>
            Fill in your details and we'll confirm your appointment.
          </p>
        </div>

        <div
          className="rounded-2xl p-8 border"
          style={{ background: "#0B2440", borderColor: "#163A5E" }}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            data-ocid="booking.form"
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
                  value={form.customerName}
                  onChange={(e) => set("customerName", e.target.value)}
                  required
                  placeholder="John Smith"
                  style={{
                    background: "#071A2F",
                    borderColor: "#163A5E",
                    color: "white",
                  }}
                  data-ocid="booking.name.input"
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
                  data-ocid="booking.email.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label
                  className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                  style={{ color: "#B9C7D9" }}
                >
                  Phone *
                </Label>
                <Input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  required
                  placeholder="+1 234 567 8900"
                  style={{
                    background: "#071A2F",
                    borderColor: "#163A5E",
                    color: "white",
                  }}
                  data-ocid="booking.phone.input"
                />
              </div>
              <div>
                <Label
                  className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                  style={{ color: "#B9C7D9" }}
                >
                  Service Type *
                </Label>
                <Select
                  value={form.serviceId}
                  onValueChange={(v) => set("serviceId", v)}
                  required
                >
                  <SelectTrigger
                    style={{
                      background: "#071A2F",
                      borderColor: "#163A5E",
                      color: "white",
                    }}
                    data-ocid="booking.service.select"
                  >
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent
                    style={{ background: "#0B2440", borderColor: "#163A5E" }}
                  >
                    {SERVICE_OPTIONS.map((s) => (
                      <SelectItem
                        key={s.id}
                        value={s.id}
                        style={{ color: "white" }}
                      >
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label
                className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                style={{ color: "#B9C7D9" }}
              >
                Address *
              </Label>
              <Input
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                required
                placeholder="123 Main St, City, State"
                style={{
                  background: "#071A2F",
                  borderColor: "#163A5E",
                  color: "white",
                }}
                data-ocid="booking.address.input"
              />
            </div>
            <div>
              <Label
                className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                style={{ color: "#B9C7D9" }}
              >
                Preferred Date *
              </Label>
              <Popover open={calOpen} onOpenChange={setCalOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    style={{
                      background: "#071A2F",
                      borderColor: "#163A5E",
                      color: date ? "white" : "#6F88A3",
                    }}
                    data-ocid="booking.date.button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  style={{ background: "#0B2440", borderColor: "#163A5E" }}
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setCalOpen(false);
                    }}
                    disabled={(d) => d < new Date()}
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label
                className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                style={{ color: "#B9C7D9" }}
              >
                Notes
              </Label>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Any special requirements or access instructions..."
                rows={3}
                style={{
                  background: "#071A2F",
                  borderColor: "#163A5E",
                  color: "white",
                }}
                data-ocid="booking.notes.textarea"
              />
            </div>
            <Button
              type="submit"
              className="w-full font-bold uppercase tracking-widest py-5"
              disabled={bookService.isPending}
              style={{ background: "#1E7BFF", color: "white" }}
              data-ocid="booking.submit.button"
            >
              {bookService.isPending ? "Submitting..." : "BOOK SERVICE"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
