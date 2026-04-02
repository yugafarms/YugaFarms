import React from "react";
// import ClientBlogPage from "./ClientBlogPage";
import ClientBlogPage from "./ClientBlogPage";

// In Next.js 15+, dynamic route params are Promises
export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  
  return <ClientBlogPage slug={params.slug} />;
}
