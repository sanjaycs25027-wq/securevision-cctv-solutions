import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateCheckoutSession } from "../hooks/useQueries";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const createCheckout = useCreateCheckoutSession();
  const { identity } = useInternetIdentity();

  const handleCheckout = async () => {
    if (!identity) {
      toast.error("Please log in to proceed with checkout.");
      return;
    }
    try {
      const shoppingItems = items.map((item) => ({
        productName: item.name,
        currency: "usd",
        quantity: BigInt(item.quantity),
        priceInCents: BigInt(Math.round(item.price * 100)),
        productDescription: item.category || item.name,
      }));
      const session = await createCheckout.mutateAsync(shoppingItems);
      if (!session?.url) throw new Error("Stripe session missing url");
      window.location.href = session.url;
    } catch (err: any) {
      toast.error(err?.message || "Checkout failed. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center text-white">
        <ShoppingCart className="w-20 h-20 mx-auto mb-4 opacity-20" />
        <h2 className="text-2xl font-bold uppercase mb-2">
          Your Cart is Empty
        </h2>
        <p className="mb-6" style={{ color: "#B9C7D9" }}>
          Browse our catalog to add security equipment.
        </p>
        <Link to="/catalog">
          <Button
            style={{ background: "#1E7BFF", color: "white" }}
            className="font-bold uppercase"
            data-ocid="cart.browse.button"
          >
            Browse Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-2">
            YOUR CART
          </h1>
          <p style={{ color: "#B9C7D9" }}>
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3" data-ocid="cart.items.list">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-xl border p-4 flex items-center gap-4"
                style={{ background: "#0B2440", borderColor: "#163A5E" }}
                data-ocid={`cart.item.${idx + 1}`}
              >
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#071A2F" }}
                >
                  <ShoppingCart
                    className="w-8 h-8 opacity-30"
                    style={{ color: "#1E7BFF" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-white truncate">
                    {item.name}
                  </h4>
                  {item.category && (
                    <p className="text-xs" style={{ color: "#6F88A3" }}>
                      {item.category}
                    </p>
                  )}
                  <p className="font-bold" style={{ color: "#1E7BFF" }}>
                    ${item.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-7 h-7 p-0 rounded-full border"
                    style={{ borderColor: "#163A5E", color: "#B9C7D9" }}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    data-ocid={`cart.decrease.${idx + 1}`}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-6 text-center font-semibold text-sm">
                    {item.quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-7 h-7 p-0 rounded-full border"
                    style={{ borderColor: "#163A5E", color: "#B9C7D9" }}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    data-ocid={`cart.increase.${idx + 1}`}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-right min-w-[60px]">
                  <p className="font-bold text-sm text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1"
                  style={{ color: "#ef4444" }}
                  onClick={() => removeItem(item.id)}
                  data-ocid={`cart.delete_button.${idx + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div>
            <div
              className="rounded-xl border p-6 sticky top-24"
              style={{ background: "#0B2440", borderColor: "#163A5E" }}
            >
              <h3 className="font-bold uppercase tracking-wide mb-4">
                Order Summary
              </h3>
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span style={{ color: "#B9C7D9" }}>
                      {item.name} x{item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator style={{ background: "#163A5E" }} className="my-4" />
              <div className="flex justify-between font-bold mb-6">
                <span>Total</span>
                <span style={{ color: "#1E7BFF" }}>${total.toFixed(2)}</span>
              </div>
              <Button
                className="w-full font-bold uppercase tracking-widest py-5"
                onClick={handleCheckout}
                disabled={createCheckout.isPending}
                style={{ background: "#1E7BFF", color: "white" }}
                data-ocid="cart.checkout.button"
              >
                {createCheckout.isPending ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  "PROCEED TO CHECKOUT"
                )}
              </Button>
              <Button
                variant="ghost"
                className="w-full mt-2 text-xs"
                style={{ color: "#6F88A3" }}
                onClick={clearCart}
                data-ocid="cart.clear.button"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
