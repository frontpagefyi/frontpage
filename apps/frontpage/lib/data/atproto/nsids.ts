import * as fyi from "@repo/frontpage-atproto-client/fyi";

export const nsids = {
  FyiFrontpageFeedPost: fyi.frontpage.feed.post.$type,
  FyiUnravelFrontpagePost: fyi.unravel.frontpage.post.$type,
  FyiFrontpageFeedComment: fyi.frontpage.feed.comment.$type,
  FyiUnravelFrontpageComment: fyi.unravel.frontpage.comment.$type,
  FyiFrontpageFeedVote: fyi.frontpage.feed.vote.$type,
  FyiUnravelFrontpageVote: fyi.unravel.frontpage.vote.$type,
  FyiFrontpageFeedGenerator: fyi.frontpage.feed.generator.$type,
  FyiFrontpageFeedGetFeedSkeleton: fyi.frontpage.feed.getFeedSkeleton.$nsid,
  FyiFrontpageFeedDescribeFeedGenerator:
    fyi.frontpage.feed.describeFeedGenerator.$nsid,
} as const;
