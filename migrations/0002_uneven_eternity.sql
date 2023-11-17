ALTER TABLE amaranto_user ADD `stripe_session_id` text;--> statement-breakpoint
ALTER TABLE `amaranto_user` DROP COLUMN `subscription_id`;