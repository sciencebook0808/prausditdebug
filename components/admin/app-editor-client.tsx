"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, ExternalLink, Plus, Trash2, GripVertical } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Application, Documentation } from "@/lib/types";
import { DocEditor } from "./doc-editor";

export function AppEditorClient({
  application,
  documentation: initialDocs,
}: {
  application: Application;
  documentation: Documentation[];
}) {
  const router = useRouter();
  const [app, setApp] = useState(application);
  const [docs, setDocs] = useState(initialDocs);
  const [saving, setSaving] = useState(false);
  const [createDocOpen, setCreateDocOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Documentation | null>(null);

  async function saveApp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/admin/applications/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          slug: fd.get("slug"),
          introduction: fd.get("introduction"),
          heroImage: fd.get("heroImage"),
          status: fd.get("status"),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setApp(data.application);
        toast.success("Application saved");
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function createDoc(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/documentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: app.id,
          title: fd.get("title"),
          slug: fd.get("slug"),
          parentId: fd.get("parentId") || null,
          content: "",
          sortOrder: docs.length,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDocs((prev) => [...prev, data.doc]);
        setCreateDocOpen(false);
        toast.success("Documentation page created");
      } else {
        toast.error(data.error || "Failed to create");
      }
    } catch {
      toast.error("Failed to create doc");
    }
  }

  async function deleteDoc(id: number) {
    if (!confirm("Delete this documentation page?")) return;
    try {
      await fetch(`/api/admin/documentation/${id}`, { method: "DELETE" });
      setDocs((prev) => prev.filter((d) => d.id !== id));
      if (editingDoc?.id === id) setEditingDoc(null);
      toast.success("Documentation deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function saveDocContent(id: number, content: string) {
    try {
      const res = await fetch(`/api/admin/documentation/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setDocs((prev) =>
          prev.map((d) => (d.id === id ? { ...d, content } : d))
        );
        toast.success("Documentation saved");
      }
    } catch {
      toast.error("Failed to save");
    }
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const parentOptions = docs.filter((d) => d.parentId === null);

  if (editingDoc) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingDoc(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Docs
          </Button>
          <h2 className="text-lg font-semibold text-foreground">
            {editingDoc.title}
          </h2>
        </div>
        <DocEditor
          doc={editingDoc}
          onSave={(content) => saveDocContent(editingDoc.id, content)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Link href="/admin/applications">
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{app.name}</h1>
        </div>
        <Button asChild variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground">
          <Link href={`/${app.slug}`} target="_blank">
            <ExternalLink size={14} className="mr-2" />
            View Public Page
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-secondary mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview">
          <form
            onSubmit={saveApp}
            className="max-w-2xl rounded-xl border border-border bg-card p-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Name</Label>
                <Input
                  name="name"
                  defaultValue={app.name}
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Slug</Label>
                <Input
                  name="slug"
                  defaultValue={app.slug}
                  required
                  className="bg-input border-border text-foreground font-mono text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Introduction</Label>
                <Textarea
                  name="introduction"
                  defaultValue={app.introduction || ""}
                  rows={4}
                  className="bg-input border-border text-foreground resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Hero Image URL</Label>
                <Input
                  name="heroImage"
                  defaultValue={app.heroImage || ""}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Status</Label>
                <Select name="status" defaultValue={app.status}>
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
                disabled={saving}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save size={16} className="mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Documentation tab */}
        <TabsContent value="documentation">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {docs.length} page{docs.length !== 1 ? "s" : ""}
            </p>
            <Dialog open={createDocOpen} onOpenChange={setCreateDocOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus size={14} className="mr-1" />
                  New Page
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    Create Documentation Page
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={createDoc} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-foreground">Title</Label>
                    <Input
                      name="title"
                      required
                      placeholder="Page title"
                      className="bg-input border-border text-foreground"
                      onChange={(e) => {
                        const slugField =
                          e.currentTarget.form?.querySelector(
                            'input[name="slug"]'
                          ) as HTMLInputElement;
                        if (slugField)
                          slugField.value = slugify(e.target.value);
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-foreground">Slug</Label>
                    <Input
                      name="slug"
                      required
                      placeholder="page-slug"
                      className="bg-input border-border text-foreground font-mono text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-foreground">
                      Parent Page (optional)
                    </Label>
                    <select
                      name="parentId"
                      className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
                    >
                      <option value="">None (top-level)</option>
                      {parentOptions.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Create Page
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-xl border border-border bg-card">
            {docs.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No documentation pages yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {docs
                  .filter((d) => d.parentId === null)
                  .map((doc) => (
                    <div key={doc.id}>
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50">
                        <GripVertical
                          size={16}
                          className="text-muted-foreground/40"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {doc.title}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            /{app.slug}/docs/{doc.slug}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingDoc(doc)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteDoc(doc.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      {/* Children */}
                      {docs
                        .filter((c) => c.parentId === doc.id)
                        .map((child) => (
                          <div
                            key={child.id}
                            className="flex items-center gap-3 px-4 py-3 pl-12 hover:bg-secondary/50"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-foreground">
                                {child.title}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono">
                                /{app.slug}/docs/{child.slug}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingDoc(child)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteDoc(child.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Settings tab */}
        <TabsContent value="settings">
          <div className="max-w-2xl rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Danger Zone
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Deleting this application will permanently remove all associated
              documentation.
            </p>
            <Button
              variant="destructive"
              onClick={async () => {
                if (
                  !confirm(
                    "Are you sure? This will delete all associated documentation."
                  )
                )
                  return;
                await fetch(`/api/admin/applications/${app.id}`, {
                  method: "DELETE",
                });
                router.push("/admin/applications");
              }}
            >
              <Trash2 size={16} className="mr-2" />
              Delete Application
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
