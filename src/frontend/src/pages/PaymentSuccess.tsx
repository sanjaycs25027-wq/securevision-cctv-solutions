import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "../contexts/CartContext";

export default function PaymentSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="py-20 text-center text-white">
      <div className="container mx-auto px-4 max-w-md">
        <div
          className="rounded-2xl border p-10"
          style={{ background: "#0B2440", borderColor: "#163A5E" }}
        >
          <CheckCircle
            className="w-20 h-20 mx-auto mb-6"
            style={{ color: "#22c55e" }}
          />
          <h2 className="text-3xl font-extrabold uppercase mb-3">
            PAYMENT SUCCESSFUL!
          </h2>
          <p className="mb-2" style={{ color: "#B9C7D9" }}>
            Thank you for your order. We've received your payment and will
            process your order shortly.
          </p>
          <p className="text-sm mb-8" style={{ color: "#6F88A3" }}>
            A confirmation email will be sent to you soon.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/account">
              <Button
                className="w-full font-bold uppercase"
                style={{ background: "#1E7BFF", color: "white" }}
                data-ocid="payment_success.account.button"
              >
                View My Orders
              </Button>
            </Link>
            <Link to="/catalog">
              <Button
                variant="outline"
                className="w-full font-bold uppercase border"
                style={{
                  borderColor: "#163A5E",
                  color: "#B9C7D9",
                  background: "transparent",
                }}
                data-ocid="payment_success.catalog.button"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
