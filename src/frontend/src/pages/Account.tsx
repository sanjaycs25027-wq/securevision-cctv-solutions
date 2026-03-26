import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Loader2, Package, Shield, Star, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetUserBookings,
  useGetUserOrders,
  useSaveProfile,
  useUpgradeToPremium,
} from "../hooks/useQueries";

export default function Account() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const qc = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: profile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const userId = identity?.getPrincipal();
  const { data: orders } = useGetUserOrders(userId);
  const { data: bookings } = useGetUserBookings(userId);
  const upgradeToPremium = useUpgradeToPremium();
  const saveProfile = useSaveProfile();

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center text-white">
        <Shield
          className="w-16 h-16 mx-auto mb-4 opacity-30"
          style={{ color: "#1E7BFF" }}
        />
        <h2 className="text-3xl font-bold uppercase mb-3">MY ACCOUNT</h2>
        <p className="mb-6" style={{ color: "#B9C7D9" }}>
          Please log in to access your account.
        </p>
        <Button
          onClick={() => login()}
          disabled={isLoggingIn}
          style={{ background: "#1E7BFF", color: "white" }}
          className="font-bold uppercase tracking-widest"
          data-ocid="account.login.button"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="py-20 text-center" data-ocid="account.loading_state">
        <Loader2
          className="w-8 h-8 animate-spin mx-auto"
          style={{ color: "#1E7BFF" }}
        />
      </div>
    );
  }

  const isPremium = profile?.role === "premium" || profile?.role === "admin";

  const handleUpgrade = async () => {
    if (!userId) return;
    try {
      await upgradeToPremium.mutateAsync(userId);
      toast.success("Upgraded to Premium!");
    } catch {
      toast.error("Upgrade failed.");
    }
  };

  const startEdit = () => {
    setEditForm({
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
    });
    setEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfile.mutateAsync({
        ...editForm,
        role: profile?.role || "user",
      });
      setEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const handleLogout = async () => {
    await clear();
    qc.clear();
  };

  return (
    <div className="py-12 text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#2FA8FF" }}
            >
              My Account
            </p>
            <h1 className="text-4xl font-extrabold uppercase tracking-tight">
              PROFILE
            </h1>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-xs uppercase"
            style={{ color: "#ef4444" }}
            data-ocid="account.logout.button"
          >
            Logout
          </Button>
        </div>

        {/* Profile card */}
        <div
          className="rounded-2xl border p-6 mb-6"
          style={{ background: "#0B2440", borderColor: "#163A5E" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold"
              style={{ background: "rgba(30,123,255,0.2)" }}
            >
              <User className="w-8 h-8" style={{ color: "#1E7BFF" }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold">{profile?.name || "User"}</h2>
                {isPremium && (
                  <Badge
                    style={{
                      background: "linear-gradient(90deg, #1E7BFF, #2FA8FF)",
                      color: "white",
                    }}
                    data-ocid="account.premium.badge"
                  >
                    <Star className="w-3 h-3 mr-1" /> PREMIUM
                  </Badge>
                )}
              </div>
              <p className="text-sm" style={{ color: "#B9C7D9" }}>
                {profile?.email}
              </p>
              <p className="text-sm" style={{ color: "#B9C7D9" }}>
                {profile?.phone}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-xs uppercase border"
              style={{
                borderColor: "#163A5E",
                color: "#B9C7D9",
                background: "transparent",
              }}
              onClick={startEdit}
              data-ocid="account.edit.button"
            >
              Edit Profile
            </Button>
          </div>

          {editing && (
            <form
              onSubmit={handleSave}
              className="mt-6 space-y-3 pt-4 border-t"
              style={{ borderColor: "#163A5E" }}
              data-ocid="account.edit.form"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs" style={{ color: "#B9C7D9" }}>
                    Name
                  </Label>
                  <Input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, name: e.target.value }))
                    }
                    style={{
                      background: "#071A2F",
                      borderColor: "#163A5E",
                      color: "white",
                    }}
                    data-ocid="account.name.input"
                  />
                </div>
                <div>
                  <Label className="text-xs" style={{ color: "#B9C7D9" }}>
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, email: e.target.value }))
                    }
                    style={{
                      background: "#071A2F",
                      borderColor: "#163A5E",
                      color: "white",
                    }}
                    data-ocid="account.email.input"
                  />
                </div>
                <div>
                  <Label className="text-xs" style={{ color: "#B9C7D9" }}>
                    Phone
                  </Label>
                  <Input
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    style={{
                      background: "#071A2F",
                      borderColor: "#163A5E",
                      color: "white",
                    }}
                    data-ocid="account.phone.input"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  style={{ background: "#1E7BFF", color: "white" }}
                  disabled={saveProfile.isPending}
                  data-ocid="account.save.button"
                >
                  {saveProfile.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                  style={{ color: "#6F88A3" }}
                  data-ocid="account.cancel.button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {!isPremium && (
            <div
              className="mt-4 pt-4 border-t flex items-center justify-between"
              style={{ borderColor: "#163A5E" }}
            >
              <div>
                <p className="font-semibold text-sm">Upgrade to Premium</p>
                <p className="text-xs" style={{ color: "#B9C7D9" }}>
                  Priority support, special pricing, dedicated account manager
                </p>
              </div>
              <Button
                size="sm"
                style={{
                  background: "linear-gradient(90deg, #1E7BFF, #2FA8FF)",
                  color: "white",
                }}
                onClick={handleUpgrade}
                disabled={upgradeToPremium.isPending}
                data-ocid="account.upgrade.button"
              >
                <Star className="w-3 h-3 mr-1" />
                {upgradeToPremium.isPending ? "Upgrading..." : "Get Premium"}
              </Button>
            </div>
          )}
        </div>

        {/* Orders & Bookings tabs */}
        <Tabs defaultValue="orders" data-ocid="account.tabs">
          <TabsList style={{ background: "#0B2440" }}>
            <TabsTrigger value="orders" data-ocid="account.orders.tab">
              <Package className="w-4 h-4 mr-1" /> Orders
            </TabsTrigger>
            <TabsTrigger value="bookings" data-ocid="account.bookings.tab">
              <Calendar className="w-4 h-4 mr-1" /> Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {!orders || orders.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="account.orders.empty_state"
              >
                <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p style={{ color: "#6F88A3" }}>No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {orders.map((order, idx) => (
                  <div
                    key={order.id.toString()}
                    className="rounded-xl border p-4"
                    style={{ background: "#0B2440", borderColor: "#163A5E" }}
                    data-ocid={`account.orders.item.${idx + 1}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">
                        Order #{order.id.toString()}
                      </span>
                      <Badge
                        style={{
                          background: "rgba(30,123,255,0.2)",
                          color: "#2FA8FF",
                          border: "1px solid rgba(30,123,255,0.3)",
                        }}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs" style={{ color: "#6F88A3" }}>
                      {format(new Date(Number(order.createdAt)), "MMM d, yyyy")}
                    </p>
                    <p className="font-bold mt-1" style={{ color: "#1E7BFF" }}>
                      ${(Number(order.totalPrice) / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            {!bookings || bookings.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="account.bookings.empty_state"
              >
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p style={{ color: "#6F88A3" }}>No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {bookings.map((booking, idx) => (
                  <div
                    key={booking.id.toString()}
                    className="rounded-xl border p-4"
                    style={{ background: "#0B2440", borderColor: "#163A5E" }}
                    data-ocid={`account.bookings.item.${idx + 1}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">
                        {booking.serviceId}
                      </span>
                      <Badge
                        style={{
                          background: "rgba(30,123,255,0.2)",
                          color: "#2FA8FF",
                          border: "1px solid rgba(30,123,255,0.3)",
                        }}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-xs" style={{ color: "#B9C7D9" }}>
                      {booking.address}
                    </p>
                    <p className="text-xs" style={{ color: "#6F88A3" }}>
                      {format(
                        new Date(Number(booking.scheduledDate)),
                        "MMM d, yyyy",
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
