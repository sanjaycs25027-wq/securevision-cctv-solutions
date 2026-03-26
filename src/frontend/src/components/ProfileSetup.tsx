import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useSaveProfile } from "../hooks/useQueries";

export default function ProfileSetup() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveProfile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const isAuthenticated = !!identity;
  const showSetup =
    isAuthenticated && !isLoading && isFetched && profile === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await saveProfile.mutateAsync({ name, email, phone, role: "user" });
      toast.success("Profile created!");
    } catch {
      toast.error("Failed to save profile");
    }
  };

  if (!showSetup) return null;

  return (
    <Dialog open={true}>
      <DialogContent
        className="bg-navy-800 border-navy-700 text-white"
        style={{ background: "#0B2440", border: "1px solid #163A5E" }}
      >
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Welcome to SecureVision!
          </DialogTitle>
          <DialogDescription className="text-brand-gray">
            Please set up your profile to continue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="setup-name" className="text-brand-gray">
              Full Name *
            </Label>
            <Input
              id="setup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="bg-navy-900 border-navy-700 text-white placeholder:text-brand-muted"
              style={{
                background: "#071A2F",
                borderColor: "#163A5E",
                color: "white",
              }}
            />
          </div>
          <div>
            <Label htmlFor="setup-email" className="text-brand-gray">
              Email
            </Label>
            <Input
              id="setup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-navy-900 border-navy-700 text-white placeholder:text-brand-muted"
              style={{
                background: "#071A2F",
                borderColor: "#163A5E",
                color: "white",
              }}
            />
          </div>
          <div>
            <Label htmlFor="setup-phone" className="text-brand-gray">
              Phone
            </Label>
            <Input
              id="setup-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              className="bg-navy-900 border-navy-700 text-white placeholder:text-brand-muted"
              style={{
                background: "#071A2F",
                borderColor: "#163A5E",
                color: "white",
              }}
            />
          </div>
          <Button
            type="submit"
            disabled={saveProfile.isPending || !name.trim()}
            className="w-full font-semibold uppercase tracking-wide"
            style={{ background: "#1E7BFF", color: "white" }}
          >
            {saveProfile.isPending ? "Saving..." : "Create Profile"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
