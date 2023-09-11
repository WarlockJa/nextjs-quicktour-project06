import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// TAG revalidation
// e.g a webhook to `your-website.com/api/revalidate?tag=collection&secret=<token>`
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");

  if (secret !== process.env.MY_SECRET_TOKEN) {
    return NextResponse.json(
      { message: "Invalid secret" },
      {
        status: 401,
        statusText: "Unauthorized",
        headers: { "Content-Type": "Application/json" },
      }
    );
  }

  if (!tag) {
    return NextResponse.json({ message: "Missing tag param" }, { status: 400 });
  }

  revalidateTag(tag);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

// PATH revalidation
// e.g a webhook to `http://localhost:3000/api/revalidate?path=/&secret=<token>`
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const path = request.nextUrl.searchParams.get("path") || "/";

  if (secret !== process.env.MY_SECRET_TOKEN) {
    return NextResponse.json(
      { message: "Invalid secret" },
      {
        status: 401,
        statusText: "Unauthorized",
        headers: { "Content-Type": "Application/json" },
      }
    );
  }

  revalidatePath(path);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
