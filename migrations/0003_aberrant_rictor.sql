ALTER TABLE amaranto_user ADD `stripe_subscription_id` text;--> statement-breakpoint
ALTER TABLE `amaranto_user` DROP COLUMN `stripe_session_id`;