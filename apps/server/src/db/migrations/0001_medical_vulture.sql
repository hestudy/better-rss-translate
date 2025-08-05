CREATE TABLE `feed` (
	`id` text PRIMARY KEY NOT NULL,
	`feed_url` text NOT NULL,
	`title` text,
	`description` text,
	`link` text,
	`create_date` integer,
	`last_update` integer,
	`job_id` text,
	`job_status` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `feeditem` (
	`id` text PRIMARY KEY NOT NULL,
	`feed_id` text NOT NULL,
	`title` text,
	`contentSnippet` text,
	`link` text NOT NULL,
	`pub_date` text,
	`guid` text,
	`content` text,
	`categories` text,
	`create_date` integer,
	`last_update` integer,
	`user_id` text NOT NULL,
	FOREIGN KEY (`feed_id`) REFERENCES `feed`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
