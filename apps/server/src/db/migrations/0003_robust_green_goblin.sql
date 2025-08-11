ALTER TABLE `feed` ADD `should_scrapy` integer;--> statement-breakpoint
ALTER TABLE `feed` ADD `should_translate` integer;--> statement-breakpoint
ALTER TABLE `feeditem` ADD `scrapy_content` text;--> statement-breakpoint
ALTER TABLE `feeditem` ADD `scrapy_job_id` text;--> statement-breakpoint
ALTER TABLE `feeditem` ADD `scrapy_job_status` text;--> statement-breakpoint
ALTER TABLE `feeditem` ADD `translate_title` text;--> statement-breakpoint
ALTER TABLE `feeditem` ADD `translate_contentSnippet` text;--> statement-breakpoint
ALTER TABLE `feeditem` ADD `translate_content` text;--> statement-breakpoint
ALTER TABLE `feeditem` ADD `translate_job_id` text;--> statement-breakpoint
ALTER TABLE `feeditem` ADD `translate_job_status` text;