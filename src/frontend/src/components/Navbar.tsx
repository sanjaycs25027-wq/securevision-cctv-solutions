import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, Shield, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsAdmin } from "../hooks/useQueries";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const qc = useQueryClient();
  const { data: profile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsAdmin();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const navLinks = [
    { label: "HOME", to: "/" },
    { label: "CATALOG", to: "/catalog" },
    { label: "SERVICES", to: "/services" },
    { label: "FORUM", to: "/forum" },
    { label: "CONTACT", to: "/contact" },
  ];

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
    } else {
      try {
        await login();
      } catch (err: any) {
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: "#071A2F", borderColor: "#163A5E" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "#1E7BFF" }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-wide">
              SecureVision
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-6"
            data-ocid="main.nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs font-semibold uppercase tracking-widest transition-colors hover:text-brand-cyan"
                style={{ color: "#B9C7D9" }}
                activeProps={{ style: { color: "#2FA8FF" } }}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs font-semibold uppercase tracking-widest transition-colors"
                style={{ color: "#B9C7D9" }}
                activeProps={{ style: { color: "#2FA8FF" } }}
                data-ocid="nav.admin.link"
              >
                ADMIN
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative" data-ocid="nav.cart.button">
              <Button
                variant="ghost"
                size="sm"
                className="relative text-white hover:text-brand-cyan p-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs font-bold"
                    style={{ background: "#1E7BFF", color: "white" }}
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth button */}
            {isAuthenticated ? (
              <Link to="/account" data-ocid="nav.account.link">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center gap-1 text-xs font-semibold uppercase tracking-wide border"
                  style={{
                    borderColor: "#163A5E",
                    color: "#B9C7D9",
                    background: "transparent",
                  }}
                >
                  <User className="w-3.5 h-3.5" />
                  {profile?.name || "Account"}
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="hidden sm:flex text-xs font-bold uppercase tracking-wide"
                style={{ background: "#1E7BFF", color: "white" }}
                data-ocid="nav.login.button"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden text-white p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.mobile.toggle"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden py-4 border-t"
            style={{ borderColor: "#163A5E" }}
          >
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-semibold uppercase tracking-widest py-2"
                  style={{ color: "#B9C7D9" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-semibold uppercase tracking-widest py-2"
                  style={{ color: "#B9C7D9" }}
                  onClick={() => setMobileOpen(false)}
                >
                  ADMIN
                </Link>
              )}
              <div className="pt-2">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleAuth();
                      setMobileOpen(false);
                    }}
                    className="text-sm font-semibold uppercase text-red-400"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleAuth();
                      setMobileOpen(false);
                    }}
                    className="text-sm font-bold uppercase tracking-wide px-4 py-2 rounded"
                    style={{ background: "#1E7BFF", color: "white" }}
                  >
                    {isLoggingIn ? "Logging in..." : "Login"}
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
