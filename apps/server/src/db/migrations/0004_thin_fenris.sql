PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_feeditem` (
	`id` text PRIMARY KEY NOT NULL,
	`feed_id` text NOT NULL,
	`title` text,
	`contentSnippet` text,
	`link` text,
	`pub_date` text,
	`guid` text,
	`content` text,
	`scrapy_content` text,
	`scrapy_job_id` text,
	`scrapy_job_status` text,
	`translate_title` text,
	`translate_contentSnippet` text,
	`translate_content` text,
	`translate_job_id` text,
	`translate_job_status` text,
	`categories` text,
	`create_date` integer,
	`last_update` integer,
	`user_id` text NOT NULL,
	FOREIGN KEY (`feed_id`) REFERENCES `feed`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_feeditem`("id", "feed_id", "title", "contentSnippet", "link", "pub_date", "guid", "content", "scrapy_content", "scrapy_job_id", "scrapy_job_status", "translate_title", "translate_contentSnippet", "translate_content", "translate_job_id", "translate_job_status", "categories", "create_date", "last_update", "user_id") SELECT "id", "feed_id", "title", "contentSnippet", "link", "pub_date", "guid", "content", "scrapy_content", "scrapy_job_id", "scrapy_job_status", "translate_title", "translate_contentSnippet", "translate_content", "translate_job_id", "translate_job_status", "categories", "create_date", "last_update", "user_id" FROM `feeditem`;--> statement-breakpoint
DROP TABLE `feeditem`;--> statement-breakpoint
ALTER TABLE `__new_feeditem` RENAME TO `feeditem`;--> statement-breakpoint
PRAGMA foreign_keys=ON;