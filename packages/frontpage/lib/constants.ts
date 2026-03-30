export const FRONTPAGE_ATPROTO_HANDLE = "frontpage.fyi";
export const FRONTPAGE_APPVIEW_USER_AGENT =
  "appview/@frontpage.fyi (@frontpage.fyi, @tom.sherman.is)";

/** DID for the frontpage.fyi AT Protocol repo */
export const FRONTPAGE_DID = "did:plc:klmr76mpewpv7rtm3xgpzd7x";

/** Feed generator collection NSID */
export const FEED_GENERATOR_COLLECTION = "fyi.frontpage.feed.generator";

/** Feed URIs */
export const HOT_FEED_URI = `at://${FRONTPAGE_DID}/${FEED_GENERATOR_COLLECTION}/hot`;
export const NEW_FEED_URI = `at://${FRONTPAGE_DID}/${FEED_GENERATOR_COLLECTION}/new`;
export const TOP_FEED_URI = `at://${FRONTPAGE_DID}/${FEED_GENERATOR_COLLECTION}/top`;

export const FEED_URIS = {
  hot: HOT_FEED_URI,
  new: NEW_FEED_URI,
  top: TOP_FEED_URI,
} as const;
