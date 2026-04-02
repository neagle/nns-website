import React from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const adminTools = [
  {
    href: "/admin/analytics",
    title: "Analytics",
    description:
      "View ticket sales, revenue estimates, and performance trends across all shows.",
  },
  {
    href: "/admin/add-people",
    title: "Add People",
    description:
      "Paste a cast or crew list from Google Sheets, review parsed names, and add them to a show.",
  },
  {
    href: "/admin/search",
    title: "Search Index",
    description: "Regenerate the site search index.",
  },
];

const Page = () => {
  return (
    <div className="p-4 md:p-6 xl:p-8">
      <h1 className="mb-6">Admin</h1>
      <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
        {adminTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="card bg-base-200 hover:bg-base-300 transition-colors border border-base-300"
          >
            <div className="card-body">
              <h2 className="card-title text-base">{tool.title}</h2>
              <p className="text-sm text-base-content/60">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
