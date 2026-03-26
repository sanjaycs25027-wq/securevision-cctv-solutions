import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import ProfileSetup from "./components/ProfileSetup";
import { CartProvider } from "./contexts/CartContext";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Booking from "./pages/Booking";
import Cart from "./pages/Cart";
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import Forum from "./pages/Forum";
import Landing from "./pages/Landing";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentSuccess from "./pages/PaymentSuccess";
import Services from "./pages/Services";

function RootLayout() {
  return (
    <CartProvider>
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(180deg, #071A2F 0%, #061427 100%)",
        }}
      >
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ProfileSetup />
      <Toaster position="top-right" />
    </CartProvider>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});
const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog",
  component: Catalog,
});
const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: Services,
});
const bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book",
  component: Booking,
});
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: Cart,
});
const forumRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forum",
  component: Forum,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: Contact,
});
const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: Account,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});
const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccess,
});
const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailure,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  servicesRoute,
  bookRoute,
  cartRoute,
  forumRoute,
  contactRoute,
  accountRoute,
  adminRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
