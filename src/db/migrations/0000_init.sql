CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"emailVerified" timestamp,
	"image" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watchlist" (
	"user_id" varchar(255) NOT NULL,
	"media_type" varchar(8) NOT NULL,
	"media_id" integer NOT NULL,
	"title" text NOT NULL,
	"poster_path" text,
	"backdrop_path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "watchlist_user_id_media_type_media_id_pk" PRIMARY KEY("user_id","media_type","media_id")
);
--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "users__email__idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "watchlist__user_created__idx" ON "watchlist" USING btree ("user_id","created_at");