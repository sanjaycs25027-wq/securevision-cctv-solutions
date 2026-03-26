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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageCircle,
  Plus,
  Send,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddReply,
  useCreateCommunityPost,
  useGetCommunityPosts,
} from "../hooks/useQueries";
import { useGetCallerUserProfile } from "../hooks/useQueries";

export default function Forum() {
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { data: posts, isLoading } = useGetCommunityPosts();
  const createPost = useCreateCommunityPost();
  const addReply = useAddReply();

  const [newPostOpen, setNewPostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});

  const isAuthenticated = !!identity;
  const authorName = profile?.name || "Anonymous";

  const toggleExpand = (id: string) => {
    setExpandedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;
    try {
      await createPost.mutateAsync({
        title: postTitle,
        content: postContent,
        authorName,
      });
      setPostTitle("");
      setPostContent("");
      setNewPostOpen(false);
      toast.success("Post created!");
    } catch {
      toast.error("Failed to create post.");
    }
  };

  const handleReply = async (postId: bigint) => {
    const key = postId.toString();
    const content = replyContent[key];
    if (!content?.trim()) return;
    try {
      await addReply.mutateAsync({ postId, content, authorName });
      setReplyContent((prev) => ({ ...prev, [key]: "" }));
      toast.success("Reply added!");
    } catch {
      toast.error("Failed to add reply.");
    }
  };

  return (
    <div className="py-12 text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-start justify-between mb-10">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#2FA8FF" }}
            >
              Community
            </p>
            <h1 className="text-4xl font-extrabold uppercase tracking-tight">
              FORUM
            </h1>
          </div>
          {isAuthenticated ? (
            <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
              <DialogTrigger asChild>
                <Button
                  style={{ background: "#1E7BFF", color: "white" }}
                  className="font-bold uppercase tracking-wide flex items-center gap-2"
                  data-ocid="forum.new_post.button"
                >
                  <Plus className="w-4 h-4" /> New Post
                </Button>
              </DialogTrigger>
              <DialogContent
                style={{ background: "#0B2440", borderColor: "#163A5E" }}
                data-ocid="forum.new_post.dialog"
              >
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Create New Post
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <Input
                    placeholder="Post title"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    required
                    style={{
                      background: "#071A2F",
                      borderColor: "#163A5E",
                      color: "white",
                    }}
                    data-ocid="forum.post_title.input"
                  />
                  <Textarea
                    placeholder="Write your post content..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    required
                    rows={5}
                    style={{
                      background: "#071A2F",
                      borderColor: "#163A5E",
                      color: "white",
                    }}
                    data-ocid="forum.post_content.textarea"
                  />
                  <Button
                    type="submit"
                    className="w-full font-bold uppercase"
                    disabled={createPost.isPending}
                    style={{ background: "#1E7BFF", color: "white" }}
                    data-ocid="forum.submit_post.button"
                  >
                    {createPost.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Publish Post
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <p className="text-sm" style={{ color: "#6F88A3" }}>
              Log in to create posts
            </p>
          )}
        </div>

        {isLoading ? (
          <div
            className="text-center py-20"
            data-ocid="forum.posts.loading_state"
          >
            <Loader2
              className="w-8 h-8 animate-spin mx-auto"
              style={{ color: "#1E7BFF" }}
            />
          </div>
        ) : !posts || posts.length === 0 ? (
          <div
            className="text-center py-20"
            data-ocid="forum.posts.empty_state"
          >
            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p style={{ color: "#6F88A3" }}>
              No posts yet. Be the first to start a discussion!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, idx) => {
              const key = post.id.toString();
              const expanded = expandedPosts.has(key);
              return (
                <div
                  key={key}
                  className="rounded-xl border"
                  style={{ background: "#0B2440", borderColor: "#163A5E" }}
                  data-ocid={`forum.item.${idx + 1}`}
                >
                  <button
                    type="button"
                    className="w-full text-left p-5 flex items-start justify-between gap-4"
                    onClick={() => toggleExpand(key)}
                    data-ocid={`forum.expand.${idx + 1}`}
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-1">{post.title}</h3>
                      <div
                        className="flex items-center gap-3 text-xs"
                        style={{ color: "#6F88A3" }}
                      >
                        <span>{post.authorName}</span>
                        <span>·</span>
                        <span>
                          {format(
                            new Date(Number(post.createdAt)),
                            "MMM d, yyyy",
                          )}
                        </span>
                        <Badge
                          className="text-xs"
                          style={{
                            background: "rgba(30,123,255,0.15)",
                            color: "#2FA8FF",
                            border: "1px solid rgba(30,123,255,0.2)",
                          }}
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />{" "}
                          {post.replies.length}
                        </Badge>
                      </div>
                    </div>
                    {expanded ? (
                      <ChevronUp
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: "#6F88A3" }}
                      />
                    ) : (
                      <ChevronDown
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: "#6F88A3" }}
                      />
                    )}
                  </button>

                  {expanded && (
                    <div
                      className="px-5 pb-5 border-t"
                      style={{ borderColor: "#163A5E" }}
                    >
                      <p className="py-4 text-sm" style={{ color: "#B9C7D9" }}>
                        {post.content}
                      </p>
                      {post.replies.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {post.replies.map((reply) => (
                            <div
                              key={reply.id.toString()}
                              className="rounded-lg p-3 border-l-2"
                              style={{
                                background: "#071A2F",
                                borderLeftColor: "#1E7BFF",
                              }}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className="text-xs font-semibold"
                                  style={{ color: "#2FA8FF" }}
                                >
                                  {reply.authorName}
                                </span>
                                <span
                                  className="text-xs"
                                  style={{ color: "#6F88A3" }}
                                >
                                  {format(
                                    new Date(Number(reply.createdAt)),
                                    "MMM d",
                                  )}
                                </span>
                              </div>
                              <p
                                className="text-sm"
                                style={{ color: "#B9C7D9" }}
                              >
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      {isAuthenticated && (
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Write a reply..."
                            value={replyContent[key] || ""}
                            onChange={(e) =>
                              setReplyContent((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                            rows={2}
                            className="flex-1 text-sm"
                            style={{
                              background: "#071A2F",
                              borderColor: "#163A5E",
                              color: "white",
                            }}
                            data-ocid={`forum.reply.${idx + 1}`}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleReply(post.id)}
                            disabled={addReply.isPending}
                            className="self-end"
                            style={{ background: "#1E7BFF", color: "white" }}
                            data-ocid={`forum.send_reply.${idx + 1}`}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
