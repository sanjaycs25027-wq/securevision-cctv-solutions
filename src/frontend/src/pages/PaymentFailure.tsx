import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";

export default function PaymentFailure() {
  return (
    <div className="py-20 text-center text-white">
      <div className="container mx-auto px-4 max-w-md">
        <div
          className="rounded-2xl border p-10"
          style={{ background: "#0B2440", borderColor: "#163A5E" }}
        >
          <XCircle
            className="w-20 h-20 mx-auto mb-6"
            style={{ color: "#ef4444" }}
          />
          <h2 className="text-3xl font-extrabold uppercase mb-3">
            PAYMENT FAILED
          </h2>
          <p className="mb-2" style={{ color: "#B9C7D9" }}>
            Your payment could not be processed. No charges were made.
          </p>
          <p className="text-sm mb-8" style={{ color: "#6F88A3" }}>
            Please try again or contact us if the issue persists.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/cart">
              <Button
                className="w-full font-bold uppercase"
                style={{ background: "#1E7BFF", color: "white" }}
                data-ocid="payment_failure.cart.button"
              >
                Return to Cart
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                className="w-full font-bold uppercase border"
                style={{
                  borderColor: "#163A5E",
                  color: "#B9C7D9",
                  background: "transparent",
                }}
                data-ocid="payment_failure.contact.button"
              >
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
