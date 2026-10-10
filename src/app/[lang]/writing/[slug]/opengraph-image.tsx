import { notFound } from "next/navigation";
import { postImage } from "@/lib/og";
import { localeOf } from "@/lib/lang";
import { formatDate, getPost, getPosts } from "@/lib/writing";

export const alt = "A post by Luan Fabri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;
  const lang = await localeOf(params);
  const post = getPost(slug, lang);
  if (!post) notFound();
  return postImage({
    title: post.title,
    date: formatDate(post.date, lang),
    minutes: post.minutes,
  });
}
