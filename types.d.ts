type Meta = {
  id: string;
  title: string;
  date: string;
  tags: string[];
};

type BlogPost = {
  meta: Meta;
  // content type is coming from next-mdx-remote compileMDX method lib/Posts.ts
  content: ReactElement<any, string | JSXElementConstructor<any>>;
};
