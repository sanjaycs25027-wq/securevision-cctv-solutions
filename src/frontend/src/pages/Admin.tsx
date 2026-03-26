import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Calendar,
  Key,
  Loader2,
  MessageSquare,
  Package,
  Plus,
  Settings,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useDeleteProduct,
  useGetAllBookings,
  useGetAllOrders,
  useGetContactMessages,
  useGetProducts,
  useIsAdmin,
  useIsStripeConfigured,
  useMarkMessageRead,
  useSetStripeConfiguration,
  useUpdateBookingStatus,
  useUpdateOrderStatus,
} from "../hooks/useQueries";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];
export default function Admin() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  const { data: orders } = useGetAllOrders();
  const { data: bookings } = useGetAllBookings();
  const { data: messages } = useGetContactMessages();
  const { data: products } = useGetProducts();
  const { data: stripeConfigured } = useIsStripeConfigured();

  const updateOrderStatus = useUpdateOrderStatus();
  const updateBookingStatus = useUpdateBookingStatus();
  const markRead = useMarkMessageRead();
  const addProduct = useAddProduct();
  const deleteProduct = useDeleteProduct();
  const setStripeConfig = useSetStripeConfiguration();

  const [addProductOpen, setAddProductOpen] = useState(false);
  const [stripeOpen, setStripeOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
  });
  const [stripeKey, setStripeKey] = useState("");
  const [stripeCountries, setStripeCountries] = useState("US,CA,GB,AU");

  if (!identity) {
    return (
      <div className="py-20 text-center text-white">
        <Shield
          className="w-16 h-16 mx-auto mb-4 opacity-30"
          style={{ color: "#1E7BFF" }}
        />
        <h2 className="text-2xl font-bold uppercase mb-2">
          Admin Access Required
        </h2>
        <p style={{ color: "#B9C7D9" }}>
          Please log in to access the admin dashboard.
        </p>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="py-20 text-center" data-ocid="admin.loading_state">
        <Loader2
          className="w-8 h-8 animate-spin mx-auto"
          style={{ color: "#1E7BFF" }}
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="py-20 text-center text-white"
        data-ocid="admin.error_state"
      >
        <Shield
          className="w-16 h-16 mx-auto mb-4"
          style={{ color: "#ef4444" }}
        />
        <h2 className="text-2xl font-bold uppercase mb-2">Access Denied</h2>
        <p style={{ color: "#B9C7D9" }}>You don't have admin permissions.</p>
      </div>
    );
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct.mutateAsync({
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        price: BigInt(Math.round(Number(newProduct.price) * 100)),
        stock: BigInt(Number(newProduct.stock) || 0),
        imageUrl: "",
      });
      setNewProduct({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
      });
      setAddProductOpen(false);
      toast.success("Product added!");
    } catch {
      toast.error("Failed to add product.");
    }
  };

  const handleStripeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setStripeConfig.mutateAsync({
        secretKey: stripeKey,
        allowedCountries: stripeCountries.split(",").map((c) => c.trim()),
      });
      setStripeOpen(false);
      toast.success("Stripe configured!");
    } catch {
      toast.error("Failed to configure Stripe.");
    }
  };

  return (
    <div className="py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#2FA8FF" }}
            >
              Administration
            </p>
            <h1 className="text-4xl font-extrabold uppercase tracking-tight">
              ADMIN DASHBOARD
            </h1>
          </div>
          <div className="flex gap-2">
            {!stripeConfigured && (
              <Dialog open={stripeOpen} onOpenChange={setStripeOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    style={{
                      background: "#0B2440",
                      borderColor: "#163A5E",
                      color: "#B9C7D9",
                      border: "1px solid #163A5E",
                    }}
                    className="text-xs uppercase flex items-center gap-1"
                    data-ocid="admin.stripe.button"
                  >
                    <Key className="w-3 h-3" /> Setup Stripe
                  </Button>
                </DialogTrigger>
                <DialogContent
                  style={{ background: "#0B2440", borderColor: "#163A5E" }}
                  data-ocid="admin.stripe.dialog"
                >
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Configure Stripe Payment
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleStripeSetup} className="space-y-4">
                    <div>
                      <Label className="text-xs" style={{ color: "#B9C7D9" }}>
                        Stripe Secret Key
                      </Label>
                      <Input
                        type="password"
                        value={stripeKey}
                        onChange={(e) => setStripeKey(e.target.value)}
                        required
                        placeholder="sk_live_..."
                        style={{
                          background: "#071A2F",
                          borderColor: "#163A5E",
                          color: "white",
                        }}
                        data-ocid="admin.stripe_key.input"
                      />
                    </div>
                    <div>
                      <Label className="text-xs" style={{ color: "#B9C7D9" }}>
                        Allowed Countries (comma-separated)
                      </Label>
                      <Input
                        value={stripeCountries}
                        onChange={(e) => setStripeCountries(e.target.value)}
                        style={{
                          background: "#071A2F",
                          borderColor: "#163A5E",
                          color: "white",
                        }}
                        data-ocid="admin.stripe_countries.input"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full font-bold"
                      disabled={setStripeConfig.isPending}
                      style={{ background: "#1E7BFF", color: "white" }}
                      data-ocid="admin.stripe_save.button"
                    >
                      {setStripeConfig.isPending
                        ? "Saving..."
                        : "Save Stripe Config"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Orders", value: orders?.length || 0, icon: Package },
            { label: "Bookings", value: bookings?.length || 0, icon: Calendar },
            {
              label: "Messages",
              value: messages?.filter((m) => !m.read).length || 0,
              icon: MessageSquare,
              suffix: " unread",
            },
            { label: "Products", value: products?.length || 0, icon: Settings },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border p-4"
              style={{ background: "#0B2440", borderColor: "#163A5E" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-4 h-4" style={{ color: "#1E7BFF" }} />
                <span
                  className="text-xs uppercase tracking-wide"
                  style={{ color: "#6F88A3" }}
                >
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold" style={{ color: "#1E7BFF" }}>
                {stat.value}
                <span
                  className="text-xs font-normal"
                  style={{ color: "#6F88A3" }}
                >
                  {stat.suffix}
                </span>
              </p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="orders" data-ocid="admin.tabs">
          <TabsList style={{ background: "#0B2440" }} className="mb-6">
            <TabsTrigger value="orders" data-ocid="admin.orders.tab">
              Orders
            </TabsTrigger>
            <TabsTrigger value="bookings" data-ocid="admin.bookings.tab">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="messages" data-ocid="admin.messages.tab">
              Messages
            </TabsTrigger>
            <TabsTrigger value="products" data-ocid="admin.products.tab">
              Products
            </TabsTrigger>
          </TabsList>

          {/* Orders */}
          <TabsContent value="orders">
            <div
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: "#163A5E" }}
            >
              <Table>
                <TableHeader style={{ background: "#071A2F" }}>
                  <TableRow style={{ borderColor: "#163A5E" }}>
                    <TableHead style={{ color: "#6F88A3" }}>Order ID</TableHead>
                    <TableHead style={{ color: "#6F88A3" }}>Date</TableHead>
                    <TableHead style={{ color: "#6F88A3" }}>Total</TableHead>
                    <TableHead style={{ color: "#6F88A3" }}>Status</TableHead>
                    <TableHead style={{ color: "#6F88A3" }}>Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map((order, idx) => (
                    <TableRow
                      key={order.id.toString()}
                      style={{ borderColor: "#163A5E", background: "#0B2440" }}
                      data-ocid={`admin.orders.row.${idx + 1}`}
                    >
                      <TableCell className="font-mono text-xs">
                        #{order.id.toString()}
                      </TableCell>
                      <TableCell
                        className="text-xs"
                        style={{ color: "#B9C7D9" }}
                      >
                        {format(
                          new Date(Number(order.createdAt)),
                          "MMM d, yyyy",
                        )}
                      </TableCell>
                      <TableCell style={{ color: "#1E7BFF" }}>
                        ${(Number(order.totalPrice) / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{
                            background: "rgba(30,123,255,0.15)",
                            color: "#2FA8FF",
                          }}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          onValueChange={(v) =>
                            updateOrderStatus.mutate({
                              id: order.id,
                              status: v,
                            })
                          }
                        >
                          <SelectTrigger
                            className="w-36 h-7 text-xs"
                            style={{
                              background: "#071A2F",
                              borderColor: "#163A5E",
                              color: "white",
                            }}
                            data-ocid={`admin.orders.status.${idx + 1}`}
                          >
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent
                            style={{
                              background: "#0B2440",
                              borderColor: "#163A5E",
                            }}
                          >
                            {ORDER_STATUSES.map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                style={{ color: "white" }}
                              >
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(!orders || orders.length === 0) && (
                <div
                  className="text-center py-10"
                  style={{ color: "#6F88A3" }}
                  data-ocid="admin.orders.empty_state"
                >
                  No orders yet
                </div>
              )}
            </div>
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings">
            <div
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: "#163A5E" }}
            >
              <Table>
                <TableHeader style={{ background: "#071A2F" }}>
                  <TableRow style={{ borderColor: "#163A5E" }}>
                    <TableHead style={{ color: "#6F88A3" }}>Customer</TableHead>
                    <TableHead style={{ color: "#6F88A3" }}>Service</TableHead>
                    <TableHead style={{ color: "#6F88A3" }}>Date</TableHead>
                    <TableHead style={{ color: "#6F88A3" }}>Status</TableHead>
                    <TableHead style={{ color: "#6F88A3" }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings?.map((booking, idx) => (
                    <TableRow
                      key={booking.id.toString()}
                      style={{ borderColor: "#163A5E", background: "#0B2440" }}
                      data-ocid={`admin.bookings.row.${idx + 1}`}
                    >
                      <TableCell>
                        <div className="font-semibold text-sm">
                          {booking.customerName}
                        </div>
                        <div className="text-xs" style={{ color: "#6F88A3" }}>
                          {booking.email}
                        </div>
                      </TableCell>
                      <TableCell
                        className="text-xs"
                        style={{ color: "#B9C7D9" }}
                      >
                        {booking.serviceId}
                      </TableCell>
                      <TableCell
                        className="text-xs"
                        style={{ color: "#B9C7D9" }}
                      >
                        {format(
                          new Date(Number(booking.scheduledDate)),
                          "MMM d, yyyy",
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{
                            background: "rgba(30,123,255,0.15)",
                            color: "#2FA8FF",
                          }}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            style={{ background: "#1E7BFF", color: "white" }}
                            onClick={() =>
                              updateBookingStatus.mutate({
                                id: booking.id,
                                status: "confirmed",
                              })
                            }
                            data-ocid={`admin.bookings.confirm.${idx + 1}`}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            style={{ color: "#ef4444" }}
                            onClick={() =>
                              updateBookingStatus.mutate({
                                id: booking.id,
                                status: "cancelled",
                              })
                            }
                            data-ocid={`admin.bookings.cancel.${idx + 1}`}
                          >
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(!bookings || bookings.length === 0) && (
                <div
                  className="text-center py-10"
                  style={{ color: "#6F88A3" }}
                  data-ocid="admin.bookings.empty_state"
                >
                  No bookings yet
                </div>
              )}
            </div>
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages">
            <div className="space-y-3">
              {messages?.map((msg, idx) => (
                <div
                  key={msg.id.toString()}
                  className="rounded-xl border p-4"
                  style={{
                    background: "#0B2440",
                    borderColor: msg.read ? "#163A5E" : "#1E7BFF",
                  }}
                  data-ocid={`admin.messages.item.${idx + 1}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {msg.name}
                        </span>
                        {!msg.read && (
                          <Badge
                            style={{ background: "#1E7BFF", color: "white" }}
                          >
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: "#6F88A3" }}>
                        {msg.email} · {msg.phone}
                      </p>
                      <p className="text-sm mt-2" style={{ color: "#B9C7D9" }}>
                        {msg.message}
                      </p>
                    </div>
                    {!msg.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs"
                        style={{ color: "#2FA8FF" }}
                        onClick={() => markRead.mutate(msg.id)}
                        data-ocid={`admin.messages.read.${idx + 1}`}
                      >
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {(!messages || messages.length === 0) && (
                <div
                  className="text-center py-10"
                  style={{ color: "#6F88A3" }}
                  data-ocid="admin.messages.empty_state"
                >
                  No messages
                </div>
              )}
            </div>
          </TabsContent>

          {/* Products */}
          <TabsContent value="products">
            <div className="flex justify-end mb-4">
              <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
                <DialogTrigger asChild>
                  <Button
                    style={{ background: "#1E7BFF", color: "white" }}
                    className="text-xs font-bold uppercase flex items-center gap-1"
                    data-ocid="admin.add_product.button"
                  >
                    <Plus className="w-3 h-3" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent
                  style={{ background: "#0B2440", borderColor: "#163A5E" }}
                  data-ocid="admin.add_product.dialog"
                >
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Add New Product
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddProduct} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs" style={{ color: "#B9C7D9" }}>
                          Name *
                        </Label>
                        <Input
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                          required
                          style={{
                            background: "#071A2F",
                            borderColor: "#163A5E",
                            color: "white",
                          }}
                          data-ocid="admin.product_name.input"
                        />
                      </div>
                      <div>
                        <Label className="text-xs" style={{ color: "#B9C7D9" }}>
                          Category *
                        </Label>
                        <Input
                          value={newProduct.category}
                          onChange={(e) =>
                            setNewProduct((p) => ({
                              ...p,
                              category: e.target.value,
                            }))
                          }
                          required
                          style={{
                            background: "#071A2F",
                            borderColor: "#163A5E",
                            color: "white",
                          }}
                          data-ocid="admin.product_category.input"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs" style={{ color: "#B9C7D9" }}>
                        Description
                      </Label>
                      <Input
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        style={{
                          background: "#071A2F",
                          borderColor: "#163A5E",
                          color: "white",
                        }}
                        data-ocid="admin.product_description.input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs" style={{ color: "#B9C7D9" }}>
                          Price ($) *
                        </Label>
                        <Input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct((p) => ({
                              ...p,
                              price: e.target.value,
                            }))
                          }
                          required
                          style={{
                            background: "#071A2F",
                            borderColor: "#163A5E",
                            color: "white",
                          }}
                          data-ocid="admin.product_price.input"
                        />
                      </div>
                      <div>
                        <Label className="text-xs" style={{ color: "#B9C7D9" }}>
                          Stock
                        </Label>
                        <Input
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) =>
                            setNewProduct((p) => ({
                              ...p,
                              stock: e.target.value,
                            }))
                          }
                          style={{
                            background: "#071A2F",
                            borderColor: "#163A5E",
                            color: "white",
                          }}
                          data-ocid="admin.product_stock.input"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full font-bold"
                      disabled={addProduct.isPending}
                      style={{ background: "#1E7BFF", color: "white" }}
                      data-ocid="admin.product_save.button"
                    >
                      {addProduct.isPending ? "Adding..." : "Add Product"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: "#163A5E" }}
            >
              <Table>
                <TableHeader style={{ background: "#071A2F" }}>
                  <TableRow style={{ borderColor: "#163A5E" }}>
                    <TableHead style={{ color: "#6F88A3" }}>Name</TableHead>
                    <TableHead style={{ color: "#6F88A3" }}>Category</TableHead>
                    <TableHead style={{ color: "#6F88A3" }}>Price</TableHead>
                    <TableHead style={{ color: "#6F88A3" }}>Stock</TableHead>
                    <TableHead style={{ color: "#6F88A3" }}>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((p, idx) => (
                    <TableRow
                      key={p.id.toString()}
                      style={{ borderColor: "#163A5E", background: "#0B2440" }}
                      data-ocid={`admin.products.row.${idx + 1}`}
                    >
                      <TableCell className="font-semibold text-sm">
                        {p.name}
                      </TableCell>
                      <TableCell
                        className="text-xs"
                        style={{ color: "#B9C7D9" }}
                      >
                        {p.category}
                      </TableCell>
                      <TableCell style={{ color: "#1E7BFF" }}>
                        ${(Number(p.price) / 100).toFixed(2)}
                      </TableCell>
                      <TableCell style={{ color: "#B9C7D9" }}>
                        {p.stock.toString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          style={{ color: "#ef4444" }}
                          onClick={() => deleteProduct.mutate(p.id)}
                          data-ocid={`admin.products.delete.${idx + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(!products || products.length === 0) && (
                <div
                  className="text-center py-10"
                  style={{ color: "#6F88A3" }}
                  data-ocid="admin.products.empty_state"
                >
                  No products yet
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
