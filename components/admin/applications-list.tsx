"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Plus, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Application } from "@/lib/types";

export function ApplicationsList({
  applications: initial,
}: {
  applications: Application[];
}) {
  const [applications, setApplications] = useState(initial);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/admin/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          slug: fd.get("slug"),
          introduction: fd.get("introduction"),
          heroImage: fd.get("heroImage"),
          status: fd.get("status"),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to create");
        return;
      }

      const data = await res.json();
      setApplications((prev) => [data.application, ...prev]);
      setCreateOpen(false);
      toast.success("Application created");
    } catch {
      toast.error("Failed to create application");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
      setApplications((prev) => prev.filter((a) => a.id !== id));
      toast.success("Application deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {applications.length} application{applications.length !== 1 ? "s" : ""}
        </p>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus size={16} className="mr-2" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Create Application
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Name</Label>
                <Input
                  name="name"
                  required
                  placeholder="Application name"
                  className="bg-input border-border text-foreground"
                  onChange={(e) => {
                    const slugField = e.currentTarget.form?.querySelector(
                      'input[name="slug"]'
                    ) as HTMLInputElement;
                    if (slugField) slugField.value = slugify(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Slug</Label>
                <Input
                  name="slug"
                  required
                  placeholder="application-slug"
                  className="bg-input border-border text-foreground font-mono text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Introduction</Label>
                <Textarea
                  name="introduction"
                  rows={3}
                  placeholder="Brief introduction..."
                  className="bg-input border-border text-foreground resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Hero Image URL</Label>
                <Input
                  name="heroImage"
                  placeholder="https://..."
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Status</Label>
                <Select name="status" defaultValue="draft">
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Creating..." : "Create Application"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{app.name}</h3>
                <p className="text-xs font-mono text-muted-foreground">
                  /{app.slug}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                  app.status === "published"
                    ? "bg-green-500/10 text-green-400"
                    : app.status === "draft"
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {app.status}
              </span>
            </div>
            {app.introduction && (
              <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                {app.introduction}
              </p>
            )}
            <p className="mb-4 text-xs text-muted-foreground">
              Created{" "}
              {formatDistanceToNow(new Date(app.createdAt), {
                addSuffix: true,
              })}
            </p>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline" className="border-border text-foreground hover:bg-secondary">
                <Link href={`/admin/applications/${app.id}`}>
                  <Pencil size={14} className="mr-1" />
                  Edit
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground">
                <Link href={`/${app.slug}`} target="_blank">
                  <ExternalLink size={14} className="mr-1" />
                  View
                </Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(app.id)}
                className="text-destructive hover:text-destructive ml-auto"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}

        {applications.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No applications yet. Create your first one.
          </div>
        )}
      </div>
    </div>
  );
}
