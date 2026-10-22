import type { StaticImageData } from "next/image";
import type { ComponentType } from "react";

import * as conchal from "@/content/blog/how-to-get-to-playa-conchal";
import * as monkeys from "@/content/blog/howler-monkeys-at-costa-nativa";

/**
 * The blog: English only, one module per post in src/content/blog. Each
 * module exports `meta` and a default `Body`. Posts are plain React rather
 * than Markdown so they can use the same image pipeline (static imports,
 * intrinsic sizes, blur placeholders) and need no parser dependency.
 *
 * To add a post: write the module, add one line to `modules` below.
 */
export type PostMeta = {
  slug: string;
  title: string;
  /** Meta description and the line under the title in the list. */
  description: string;
  /** ISO date, YYYY-MM-DD. Sorts the list; newest first. */
  date: string;
  minutes: number;
  image: StaticImageData;
  imageAlt: string;
};

export type Post = PostMeta & { Body: ComponentType };

type PostModule = { meta: PostMeta; default: ComponentType };
const modules: PostModule[] = [conchal, monkeys];

export const posts: Post[] = modules
  .map((m) => ({ ...m.meta, Body: m.default }))
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
