"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Search,
  Mail,
  MailOpen,
  Trash2,
  ArrowLeft,
  Circle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ContactSubmission } from "@/lib/types";

type FilterType = "all" | "read" | "unread";

export function InboxClient({
  submissions: initial,
}: {
  submissions: ContactSubmission[];
}) {
  const [submissions, setSubmissions] = useState(initial);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const selected = submissions.find((s) => s.id === selectedId);

  function filterSubmissions(role: string) {
    let filtered = submissions.filter((s) => s.roleType === role);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.subject.toLowerCase().includes(q) ||
          (s.email && s.email.toLowerCase().includes(q))
      );
    }
    if (filter === "read") filtered = filtered.filter((s) => s.isRead);
    if (filter === "unread") filtered = filtered.filter((s) => !s.isRead);
    return filtered;
  }

  async function markAsRead(id: number) {
    try {
      await fetch(`/api/admin/inbox/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isRead: true } : s))
      );
    } catch {
      toast.error("Failed to mark as read");
    }
  }

  async function deleteSubmission(id: number) {
    try {
      await fetch(`/api/admin/inbox/${id}`, { method: "DELETE" });
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setSelectedId(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  function openMessage(s: ContactSubmission) {
    setSelectedId(s.id);
    if (!s.isRead) markAsRead(s.id);
  }

  function MessageList({ role }: { role: string }) {
    const items = filterSubmissions(role);
    if (items.length === 0) {
      return (
        <div className="py-12 text-center text-muted-foreground">
          No messages found.
        </div>
      );
    }
    return (
      <div className="flex flex-col divide-y divide-border">
        {items.map((s) => (
          <button
            key={s.id}
            onClick={() => openMessage(s)}
            className={cn(
              "flex items-start gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-secondary",
              selectedId === s.id && "bg-secondary",
              !s.isRead && "bg-primary/[0.03]"
            )}
          >
            <div className="mt-1 shrink-0">
              {s.isRead ? (
                <MailOpen size={16} className="text-muted-foreground" />
              ) : (
                <Circle
                  size={8}
                  className="mt-1 fill-primary text-primary"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={cn(
                    "truncate text-sm",
                    !s.isRead
                      ? "font-semibold text-foreground"
                      : "text-foreground"
                  )}
                >
                  {s.name}
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(s.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {s.subject}
              </p>
              {s.email && (
                <p className="truncate text-xs text-muted-foreground/60">
                  {s.email}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Message detail view
  if (selected) {
    return (
      <Card className="rounded-2xl border-border">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedId(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {!selected.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAsRead(selected.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Mail size={16} className="mr-1" />
                Mark Read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteSubmission(selected.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            {selected.subject}
          </h2>
          <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">From:</span>{" "}
              {selected.name}
            </div>
            {selected.email && (
              <div>
                <span className="font-medium text-foreground">Email:</span>{" "}
                {selected.email}
              </div>
            )}
            <div>
              <span className="font-medium text-foreground">Type:</span>{" "}
              <span className="capitalize">{selected.roleType}</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Date:</span>{" "}
              {new Date(selected.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="whitespace-pre-wrap rounded-xl border border-border bg-secondary p-4 text-sm leading-relaxed text-foreground">
            {selected.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border">
      {/* Search & Filter bar */}
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-input border-border"
          />
        </div>
        <div className="flex items-center gap-2">
          {(["all", "unread", "read"] as FilterType[]).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full",
                filter === f
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="capitalize">{f}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="developer">
        <div className="border-b border-border px-4">
          <TabsList className="h-auto bg-transparent p-0">
            <TabsTrigger
              value="developer"
              className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Developer
            </TabsTrigger>
            <TabsTrigger
              value="user"
              className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              User
            </TabsTrigger>
            <TabsTrigger
              value="anonymous"
              className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Anonymous
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="developer" className="mt-0">
          <MessageList role="developer" />
        </TabsContent>
        <TabsContent value="user" className="mt-0">
          <MessageList role="user" />
        </TabsContent>
        <TabsContent value="anonymous" className="mt-0">
          <MessageList role="anonymous" />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
