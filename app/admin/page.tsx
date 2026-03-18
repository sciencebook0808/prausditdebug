import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { AppWindow, FileText, Inbox, Users, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const runtime = "nodejs";

export default async function AdminDashboard() {
  if (!isDatabaseConfigured) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Database not configured.</p>
        </div>
      </div>
    );
  }

  let appCount = 0, docCount = 0, messageCount = 0, userCount = 0, unreadCount = 0;
  try {
    [appCount, docCount, messageCount, userCount, unreadCount] =
      await Promise.all([
        prisma.application.count(),
        prisma.documentation.count(),
        prisma.contactSubmission.count(),
        prisma.user.count(),
        prisma.contactSubmission.count({ where: { isRead: false } }),
      ]);
  } catch (error) {
    console.error("Admin dashboard query error:", error);
  }

  const stats = [
    {
      label: "Applications",
      value: appCount,
      icon: AppWindow,
      accent: "primary" as const,
    },
    {
      label: "Documentation Pages",
      value: docCount,
      icon: FileText,
      accent: "accent" as const,
    },
    {
      label: "Messages",
      value: messageCount,
      icon: Inbox,
      accent: "primary" as const,
      sub: `${unreadCount} unread`,
    },
    {
      label: "Users",
      value: userCount,
      icon: Users,
      accent: "accent" as const,
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of the Prausdit platform.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    stat.accent === "primary" ? "bg-primary/10" : "bg-accent/10"
                  }`}
                >
                  <stat.icon
                    size={20}
                    className={stat.accent === "primary" ? "text-primary" : "text-accent"}
                  />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-foreground">
                {stat.value}
              </p>
              {stat.sub && (
                <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 rounded-2xl border-border">
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <a
              href="/admin/applications"
              className="rounded-xl border border-border p-4 text-center transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:scale-[1.02]"
            >
              <AppWindow size={24} className="mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium text-foreground">
                Manage Applications
              </p>
            </a>
            <a
              href="/admin/inbox"
              className="rounded-xl border border-border p-4 text-center transition-all duration-200 hover:border-accent/30 hover:bg-accent/5 hover:scale-[1.02]"
            >
              <Inbox size={24} className="mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium text-foreground">View Inbox</p>
            </a>
            <a
              href="/admin/users"
              className="rounded-xl border border-border p-4 text-center transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:scale-[1.02]"
            >
              <Users size={24} className="mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium text-foreground">Manage Users</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
