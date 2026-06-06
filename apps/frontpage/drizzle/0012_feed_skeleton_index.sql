-- Custom SQL migration file, put your code below! --
CREATE INDEX IF NOT EXISTS `idx_live_posts_created_at` ON `posts` (`created_at` DESC, `id` DESC) WHERE `status` = 'live';