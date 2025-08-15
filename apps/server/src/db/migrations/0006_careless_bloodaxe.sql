ALTER TABLE `feed` ADD `name` text;--> statement-breakpoint
ALTER TABLE `feed` ADD `status` text DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `feed` ADD `last_fetch_at` integer;--> statement-breakpoint
ALTER TABLE `feed` ADD `fetch_interval` integer DEFAULT 60;