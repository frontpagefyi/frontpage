"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { X, Loader2, Type, ImagePlus, Link2, Video, ExternalLink, ArrowRight } from "lucide-react";
import { Avatar } from "./avatar";
import { fetchLinkMeta, validateImageUrl, type LinkMeta } from "@/lib/actions/links";
import type { PostType } from "@/lib/types";

const POST_TYPES: { key: PostType; icon: typeof Type; label: string }[] = [
  { key: "text", icon: Type, label: "Text" },
  { key: "image", icon: ImagePlus, label: "Image" },
  { key: "link", icon: Link2, label: "Link" },
  { key: "video", icon: Video, label: "Video" },
];

interface ComposerUser {
  username: string;
  displayName: string;
  initials: string;
  avatarBg: string;
  avatarUrl?: string;
}

interface NewPostComposerProps {
  open: boolean;
  onClose: () => void;
  communityName: string;
  user: ComposerUser;
  onSubmit: (opts: {
    type: PostType;
    title: string;
    body?: string;
    image?: string;
    url?: string;
    linkPreview?: { image: string; title: string; domain: string };
  }) => Promise<void>;
}

export function NewPostComposer({ open, onClose, communityName, user, onSubmit }: NewPostComposerProps) {
  const [postType, setPostType] = useState<PostType>("text");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [imageValid, setImageValid] = useState<boolean | null>(null);
  const [imageChecking, setImageChecking] = useState(false);
  const [url, setUrl] = useState("");
  const [linkMeta, setLinkMeta] = useState<LinkMeta | null>(null);
  const [fetchingLink, setFetchingLink] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const titleValueRef = useRef(title);
  titleValueRef.current = title;
  const fetchIdRef = useRef(0);

  // Derived validation errors — recomputed every render from current state
  const errors = useMemo(() => {
    const e: Partial<Record<"title" | "image" | "url", string>> = {};
    if (!title.trim()) e.title = "Title is required";
    switch (postType) {
      case "image":
        if (!image.trim()) e.image = "Image URL is required";
        else if (imageChecking) e.image = "Validating image...";
        else if (imageValid === false) e.image = "URL doesn\u2019t point to a valid image";
        else if (imageValid !== true) e.image = "Paste an image URL and press Enter to validate";
        break;
      case "link":
        if (!url.trim()) e.url = "URL is required";
        else if (fetchingLink) e.url = "Fetching preview...";
        else if (!linkMeta) e.url = "Press Enter or click the arrow to fetch the preview";
        break;
      case "video":
        if (!url.trim()) e.url = "Video URL is required";
        else if (fetchingLink) e.url = "Fetching preview...";
        else if (!linkMeta) e.url = "Press Enter or click the arrow to fetch the preview";
        else if (!linkMeta.isVideo) e.url = "URL doesn\u2019t appear to be a video";
        break;
    }
    return e;
  }, [title, postType, image, imageValid, imageChecking, url, linkMeta, fetchingLink]);

  const hasErrors = Object.keys(errors).length > 0;

  // Auto-focus on open
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        if (postType === "link") urlRef.current?.focus();
        else titleRef.current?.focus();
      });
    }
  }, [open, postType]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setPostType("text");
      setTitle("");
      setBody("");
      setImage("");
      setImageValid(null);
      setImageChecking(false);
      setUrl("");
      setLinkMeta(null);
      setFetchingLink(false);
      setSubmitting(false);
      setAttempted(false);
      setSubmitError(null);
    }
  }, [open]);

  // When switching to link type, focus the URL field
  useEffect(() => {
    if (postType === "link" && open) {
      requestAnimationFrame(() => urlRef.current?.focus());
    }
  }, [postType, open]);

  // Clear attempted when switching post type so stale errors don't linger
  useEffect(() => { setAttempted(false); }, [postType]);

  const handleSubmit = async () => {
    setAttempted(true);
    setSubmitError(null);
    if (hasErrors) return;
    setSubmitting(true);
    try {
      await onSubmit({
        type: postType,
        title: title.trim(),
        body: body.trim() || undefined,
        image: postType === "image" ? image.trim() || undefined : undefined,
        url: postType === "link" || postType === "video" ? url.trim() || undefined : undefined,
        linkPreview: linkMeta?.image ? {
          image: linkMeta.image,
          title: linkMeta.title ?? title.trim(),
          domain: linkMeta.domain,
        } : undefined,
      });
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create post");
      setSubmitting(false);
    }
  };

  const doFetchLink = useCallback(async (rawUrl: string) => {
    const trimmed = rawUrl.trim();
    if (!trimmed) return;

    const normalized = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    const id = ++fetchIdRef.current;
    setUrl(normalized);
    setFetchingLink(true);
    setLinkMeta(null);

    const meta = await fetchLinkMeta(normalized);
    if (id !== fetchIdRef.current) return; // stale — user changed URL while we were fetching
    setFetchingLink(false);
    if (meta) {
      setLinkMeta(meta);
      if (!titleValueRef.current.trim() && meta.title) {
        setTitle(meta.title);
      }
    }
  }, []);

  const handleUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doFetchLink(url);
    }
  };

  // Auto-fetch on paste
  const handleUrlPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (pasted) {
      // Small delay to let the input value update
      setTimeout(() => doFetchLink(pasted), 0);
    }
  };

  // Validate image URL via server-side HEAD request
  const doValidateImage = useCallback(async (rawUrl: string) => {
    const trimmed = rawUrl.trim();
    if (!trimmed) { setImageValid(null); return; }
    try { new URL(trimmed); } catch { setImageValid(false); return; }
    const id = ++fetchIdRef.current;
    setImageChecking(true);
    const valid = await validateImageUrl(trimmed);
    if (id !== fetchIdRef.current) return; // stale
    setImageChecking(false);
    setImageValid(valid);
  }, []);

  const handleImagePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (pasted) setTimeout(() => doValidateImage(pasted), 0);
  };

  // Auto-resize title textarea
  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ animation: "fade-in 0.2s ease both" }}
        onClick={onClose}
      />

      {/* Composer panel */}
      <div
        className="relative w-full max-w-2xl mx-4 mt-[8vh] md:mt-[12vh] bg-bg-surface rounded-xl border border-bg-elevated shadow-[0_16px_70px_oklch(0%_0_0_/_0.4)] overflow-hidden"
        style={{ animation: "composer-enter 0.3s cubic-bezier(0.4, 0, 0.2, 1) both" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-bg-elevated">
          <div className="flex items-center gap-2">
            <Avatar
              initials={user.initials}
              bg={user.avatarBg}
              src={user.avatarUrl}
              size={28}
            />
            <div className="text-sm">
              <span className="font-bold text-text-primary">{user.username}</span>
              <span className="text-text-muted"> posting in </span>
              <span className="font-medium text-text-primary">{communityName}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Post type tabs */}
        <div className="flex border-b border-bg-elevated">
          {POST_TYPES.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setPostType(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
                postType === key
                  ? "text-accent-secondary border-b-2 border-accent-secondary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-3">
          {/* Link/Video URL input */}
          {(postType === "link" || postType === "video") ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  ref={urlRef}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={() => { if (!fetchingLink) doFetchLink(url); }}
                  onKeyDown={handleUrlKeyDown}
                  onPaste={handleUrlPaste}
                  placeholder={postType === "link" ? "Paste article URL..." : "Paste video URL..."}
                  className={`flex-1 px-3 py-2 text-sm bg-bg-elevated rounded-lg text-text-primary placeholder:text-text-muted/50 outline-none border transition-colors ${
                    attempted && errors.url
                      ? "border-[oklch(55%_0.2_20)]"
                      : "border-bg-overlay focus:border-accent-secondary"
                  }`}
                />
                {fetchingLink ? (
                  <Loader2 size={16} className="animate-spin text-text-muted shrink-0" />
                ) : url.trim() && !linkMeta ? (
                  <button
                    onClick={() => doFetchLink(url)}
                    className="p-2 rounded-lg text-text-muted hover:text-accent-secondary hover:bg-bg-elevated transition-colors"
                    title="Fetch link preview"
                  >
                    <ArrowRight size={16} />
                  </button>
                ) : null}
              </div>
              {attempted && errors.url ? (
                <p className="text-xs text-[oklch(55%_0.2_20)]">{errors.url}</p>
              ) : null}

              {/* Preview card */}
              {linkMeta ? (
                <>
                  {postType === "video" && !linkMeta.isVideo ? (
                    <p className="text-xs text-[oklch(55%_0.2_20)]">
                      URL doesn&apos;t appear to be a video — no video metadata found
                    </p>
                  ) : null}
                  <div className="rounded-lg bg-bg-elevated border border-bg-overlay overflow-hidden">
                    {linkMeta.image ? (
                      <Image
                        src={linkMeta.image}
                        alt=""
                        width={600}
                        height={315}
                        className="w-full aspect-[1.91/1] object-cover"
                        style={{ width: "100%", height: "auto" }}
                        unoptimized
                      />
                    ) : null}
                    <div className="px-3 py-2.5">
                      <p className="text-sm font-medium text-text-primary leading-snug">
                        {linkMeta.title ?? url}
                      </p>
                      {linkMeta.description ? (
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                          {linkMeta.description}
                        </p>
                      ) : null}
                      <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                        <ExternalLink size={10} /> {linkMeta.domain}
                      </p>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {/* Image URL input for image type */}
          {postType === "image" ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  value={image}
                  onChange={(e) => { setImage(e.target.value); setImageValid(null); }}
                  onBlur={() => { if (!imageChecking) doValidateImage(image); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); doValidateImage(image); } }}
                  onPaste={handleImagePaste}
                  placeholder="Paste image URL..."
                  className={`flex-1 px-3 py-2 text-sm bg-bg-elevated rounded-lg text-text-primary placeholder:text-text-muted/50 outline-none border transition-colors ${
                    imageValid === false || (attempted && errors.image)
                      ? "border-[oklch(55%_0.2_20)]"
                      : "border-bg-overlay focus:border-accent-secondary"
                  }`}
                />
                {imageChecking ? (
                  <Loader2 size={16} className="animate-spin text-text-muted shrink-0" />
                ) : null}
              </div>
              {(imageValid === false || (attempted && errors.image)) ? (
                <p className="text-xs text-[oklch(55%_0.2_20)]">
                  {errors.image ?? "URL doesn\u2019t point to a valid image"}
                </p>
              ) : null}
              {imageValid ? (
                <div className="rounded-lg overflow-hidden border border-bg-overlay">
                  <Image
                    src={image.trim()}
                    alt="Preview"
                    width={600}
                    height={300}
                    className="w-full max-h-48 object-cover"
                    style={{ width: "100%", height: "auto" }}
                    unoptimized
                    onError={() => setImageValid(false)}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          <div>
            <textarea
              ref={titleRef}
              value={title}
              onChange={handleTitleChange}
              placeholder="Post title"
              rows={1}
              className={`w-full bg-transparent text-lg font-serif font-semibold text-text-primary placeholder:text-text-muted/50 resize-none outline-none overflow-hidden ${
                attempted && errors.title ? "placeholder:text-[oklch(55%_0.2_20)]/50" : ""
              }`}
            />
            {attempted && errors.title ? (
              <p className="text-xs text-[oklch(55%_0.2_20)] -mt-1">{errors.title}</p>
            ) : null}
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={postType === "link" ? "Add your thoughts... (optional)" : "What's on your mind? (optional)"}
            rows={postType === "text" ? 5 : 3}
            className="w-full bg-transparent text-sm text-text-secondary placeholder:text-text-muted/50 resize-none outline-none leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-bg-elevated">
          {submitError ? (
            <p className="text-xs text-[oklch(55%_0.2_20)]">{submitError}</p>
          ) : <span />}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="relative px-4 py-2 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] overflow-hidden"
            style={{ background: "linear-gradient(135deg, oklch(40% 0.08 259), oklch(45% 0.1 290), oklch(42% 0.07 259))" }}
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
