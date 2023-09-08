import { getPostsMeta, getPostByName } from "@/lib/posts";
import getFormattedDate from "@/lib/getFormattedDate";
import Link from "next/link";
import { notFound } from "next/navigation";
// list of styles can be found in node_modules/highlight.js/styles
import "highlight.js/styles/github-dark.css";

// TODO temporary revalidation replace with an actual time
export const revalidate = 0;

type Props = {
  params: {
    postId: string;
  };
};

// turning posts/[postId] into SSG since we know which values [postId] can take
// export async function generateStaticParams() {
//   const posts = await getPostsMeta(); // deduped

//   if (!posts) return [];

//   return posts.map((post) => ({
//     postId: post.id,
//   }));
// }

export async function generateMetadata({ params: { postId } }: Props) {
  const post = await getPostByName(`${postId}.mdx`); // deduped

  if (!post)
    return {
      title: "Post not found",
    };

  return {
    title: post.meta.title,
  };
}

export default async function Post({ params: { postId } }: Props) {
  const post = await getPostByName(`${postId}.mdx`); // deduped

  if (!post) notFound();

  const pubDate = getFormattedDate(post.meta.date);

  const tags = post.meta.tags.map((tag, index) => (
    <Link key={index} href={`/tags/${tag}`}>
      {tag}
    </Link>
  ));

  return (
    <>
      <h2 className="text-3xl mt-4 mb-0">{post.meta.title}</h2>
      <p className="mt-0 text-sm">{pubDate}</p>
      <article>{post.content}</article>
      <section>
        <h3>Related:</h3>
        <div className="flex flex-grow gap-4">{tags}</div>
      </section>
      <p className="mb-10">
        <Link href={"/"}>⬅️ Back to Home</Link>
      </p>
    </>
  );
}
