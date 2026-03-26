import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CctvProduct,
  CctvService,
  CommunityPost,
  ContactMessage,
  Order,
  Reply,
  ServiceBooking,
  ShoppingItem,
  UserProfile,
} from "../backend";
import type { UserRole } from "../backend";
import { useActor } from "./useActor";

export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<CctvProduct[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetServices() {
  const { actor, isFetching } = useActor();
  return useQuery<CctvService[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCommunityPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<CommunityPost[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommunityPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetContactMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactMessage[]>({
    queryKey: ["contactMessages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<ServiceBooking[]>({
    queryKey: ["allBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserOrders(userId: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["userOrders", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getUserOrders(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useGetUserBookings(userId: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<ServiceBooking[]>({
    queryKey: ["userBookings", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getUserBookings(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}

export function useAddContactMessage() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (msg: {
      name: string;
      email: string;
      phone: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addContactMessage({
        id: BigInt(0),
        name: msg.name,
        email: msg.email,
        phone: msg.phone,
        message: msg.message,
        createdAt: BigInt(Date.now()),
        read: false,
      });
    },
  });
}

export function useBookService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (booking: Omit<ServiceBooking, "id" | "userId">) => {
      if (!actor) throw new Error("Actor not available");
      const { Principal } = await import("@icp-sdk/core/principal");
      await actor.bookService({
        ...booking,
        id: BigInt(0),
        userId: Principal.anonymous(),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userBookings"] }),
  });
}

export function useCreateCommunityPost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      content,
      authorName,
    }: { title: string; content: string; authorName: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.createCommunityPost({
        id: BigInt(0),
        title,
        content,
        createdAt: BigInt(Date.now()),
        authorName,
        replies: [],
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useAddReply() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      content,
      authorName,
    }: { postId: bigint; content: string; authorName: string }) => {
      if (!actor) throw new Error("Actor not available");
      const reply: Reply = {
        id: BigInt(0),
        content,
        createdAt: BigInt(Date.now()),
        authorName,
      };
      await actor.addReply(postId, reply);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (items: ShoppingItem[]) => {
      if (!actor) throw new Error("Actor not available");
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );
      const session = JSON.parse(result) as { id: string; url: string };
      if (!session?.url) throw new Error("Stripe session missing url");
      return session;
    },
  });
}

export function useUpgradeToPremium() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: Principal) => {
      if (!actor) throw new Error("Actor not available");
      await actor.upgradeToPremium(userId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateOrderStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allOrders"] }),
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateBookingStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allBookings"] }),
  });
}

export function useMarkMessageRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.markMessageAsRead(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contactMessages"] }),
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Omit<CctvProduct, "id">) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addProduct({ ...product, id: BigInt(0) });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["stripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      secretKey,
      allowedCountries,
    }: { secretKey: string; allowedCountries: string[] }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.setStripeConfiguration({ secretKey, allowedCountries });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stripeConfigured"] }),
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}
