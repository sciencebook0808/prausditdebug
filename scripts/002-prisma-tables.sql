-- Create tables matching Prisma schema exactly
-- Table: users
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "clerk_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_clerk_id_key" ON "users"("clerk_id");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_clerk_id_idx" ON "users"("clerk_id");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");

-- Table: applications
CREATE TABLE IF NOT EXISTS "applications" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "introduction" TEXT,
    "hero_image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "applications_slug_key" ON "applications"("slug");
CREATE INDEX IF NOT EXISTS "applications_slug_idx" ON "applications"("slug");
CREATE INDEX IF NOT EXISTS "applications_status_idx" ON "applications"("status");

-- Table: documentation
CREATE TABLE IF NOT EXISTS "documentation" (
    "id" SERIAL PRIMARY KEY,
    "application_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_id" INTEGER,
    "content" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "documentation_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "documentation_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "documentation"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "documentation_application_id_slug_key" ON "documentation"("application_id", "slug");
CREATE INDEX IF NOT EXISTS "documentation_application_id_idx" ON "documentation"("application_id");
CREATE INDEX IF NOT EXISTS "documentation_parent_id_idx" ON "documentation"("parent_id");

-- Table: contact_submissions
CREATE TABLE IF NOT EXISTS "contact_submissions" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "ip_address" TEXT,
    "role_type" TEXT NOT NULL DEFAULT 'anonymous',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "contact_submissions_role_type_idx" ON "contact_submissions"("role_type");
CREATE INDEX IF NOT EXISTS "contact_submissions_is_read_idx" ON "contact_submissions"("is_read");
CREATE INDEX IF NOT EXISTS "contact_submissions_email_idx" ON "contact_submissions"("email");
CREATE INDEX IF NOT EXISTS "contact_submissions_ip_address_idx" ON "contact_submissions"("ip_address");
