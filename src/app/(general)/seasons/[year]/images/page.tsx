import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Show } from "@/app/types";
import wixClient from "@/lib/wixClient";

interface PageProps {
  params: Promise<{ year: string }>;
}

const IMAGE_VARIANTS = [
  { label: "1200 x 630 PNG", suffix: "" },
  { label: "980 x 552 PNG", suffix: "-980x552" },
  { label: "844 x 844 PNG", suffix: "-844x844" },
];

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { year } = await params;

  return {
    title: `${year} Season Images`,
    robots: { index: false, follow: false },
  };
}

export default async function SeasonImages({ params }: PageProps) {
  const { year } = await params;
  if (!/^\d{4}$/.test(year)) notFound();

  const { items } = await wixClient.items
    .query("Shows")
    // .ne("preview", true)
    .ge("openingDate", `${year}-01-01T00:00:00.000Z`)
    .le("openingDate", `${year}-12-31T23:59:59.999Z`)
    .ascending("openingDate")
    .find();
  const shows = items as Show[];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl">{year} Season Images</h1>
      {shows.length === 0 ? (
        <p>No shows found for this season.</p>
      ) : (
        <ul className="divide-y divide-base-content/20">
          {shows.map((show) => (
            <li key={show._id} className="py-4">
              <h2 className="mb-2 text-lg">{show.title}</h2>
              {show.logo ? (
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {IMAGE_VARIANTS.map(({ label, suffix }) => (
                    <li key={label}>
                      <a
                        href={`/og/shows/${encodeURIComponent(show.slug || show._id)}${suffix}.png`}
                        className="link link-primary"
                        download
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No images available.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
