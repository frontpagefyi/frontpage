import { newPostAutoTitleUi } from "@/lib/flags";
import {
  NewPostFields,
  NewPostFields_autoTitleUi,
  NewPostFormWrapper,
} from "./new-post-client";

export async function NewPostForm({
  defaultTitle,
  defaultUrl,
}: {
  defaultTitle?: string;
  defaultUrl?: string;
}) {
  const showNewPostAutoTitleUi = await newPostAutoTitleUi();
  return (
    <NewPostFormWrapper>
      {showNewPostAutoTitleUi ? (
        <NewPostFields_autoTitleUi
          defaultTitle={defaultTitle}
          defaultUrl={defaultUrl}
        />
      ) : (
        <NewPostFields defaultTitle={defaultTitle} defaultUrl={defaultUrl} />
      )}
    </NewPostFormWrapper>
  );
}
