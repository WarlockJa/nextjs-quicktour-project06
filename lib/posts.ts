import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings/lib";
import rehypeHighlight from "rehype-highlight/lib";
import rehypeSlug from "rehype-slug";
import Video from "@/app/components/Video";
import CustomImage from "@/app/components/CustomImage";

// we get this type from git/trees
type Filetree = {
  tree: [
    {
      path: string;
    }
  ];
};

export async function getPostByName(
  fileName: string
): Promise<BlogPost | undefined> {
  const res = await fetch(process.env.GITHUB_RAW_URL! + fileName, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!res.ok) return undefined;

  // getting raw MDX file as text
  const rawMDX = await res.text();

  // if file is not found github will return a 404 string
  if (rawMDX === "404: Not Found") return undefined;

  // processing MDX data using next-mdx-remote package
  const { frontmatter, content } = await compileMDX<{
    title: string;
    date: string;
    tags: string[];
  }>({
    source: rawMDX,
    components: {
      Video,
      CustomImage,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          rehypeHighlight,
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behaviour: "wrap",
            },
          ],
        ],
      },
    },
  });

  // getting id of the file from its name without the .mdx
  const id = fileName.replace(/\.mdx$/, "");

  // forming blogPostObj from mdx data
  const blogPostObj: BlogPost = {
    meta: {
      id,
      title: frontmatter.title,
      date: frontmatter.date,
      tags: frontmatter.tags,
    },
    content,
  };

  return blogPostObj;
}

export async function getPostsMeta(): Promise<Meta[] | undefined> {
  const res = await fetch(process.env.GITHUB_API_URL!, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!res.ok) return undefined;

  // reading tree from the repo
  const repoFileTree: Filetree = await res.json();

  // selecting *.mdx files from the tree
  const filesArray = repoFileTree.tree
    .map((obj) => obj.path)
    .filter((path) => path.endsWith(".mdx"));

  const posts: Meta[] = [];

  // using for of loop in order to use await inside of it. For each will not await.
  for (const file of filesArray) {
    const post = await getPostByName(file);

    if (post) {
      const { meta } = post;
      posts.push(meta);
    }
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
