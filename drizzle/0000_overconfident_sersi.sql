-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "albums" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"authorId" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"isShared" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memory_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memoryId" uuid NOT NULL,
	"isImage" boolean DEFAULT false NOT NULL,
	"uploadUrl" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"time" time(0)
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"albumId" uuid NOT NULL,
	"authorId" varchar(255) NOT NULL,
	"isBlocked" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"caption" varchar(255) NOT NULL,
	"longitude" real,
	"latitude" real,
	"albumId" uuid NOT NULL,
	"authorId" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"date" date NOT NULL
);

*/