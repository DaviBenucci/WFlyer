import {
  PHASE3_EDITORIAL_STATUS,
  PUBLIC_STORY_CONTENT,
  type PublicChapterContent,
  type PublicContentItem,
  type PublicContentLink,
} from "@/content/public";

export type StoryContentLink = PublicContentLink;
export type StoryContentItem = PublicContentItem;
export type StoryChapterContent = PublicChapterContent;

export const STORY_V2_CONTENT_STATUS = PHASE3_EDITORIAL_STATUS;
export const STORY_V2_CONTENT = PUBLIC_STORY_CONTENT;
