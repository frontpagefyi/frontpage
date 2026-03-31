-- Compound indexes for hot and top feed cursor pagination
CREATE INDEX IF NOT EXISTS `idx_post_aggregates_rank_post_id` ON `post_aggregates` (`rank` DESC, `post_id` DESC);
CREATE INDEX IF NOT EXISTS `idx_post_aggregates_vote_count_post_id` ON `post_aggregates` (`vote_count` DESC, `post_id` DESC);
