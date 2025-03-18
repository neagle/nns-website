import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex flex-col md:flex-row h-full">
      <section className="grow-1 p-4">
        <h1 className="text-xl mb-2">Our Venue</h1>
        <Link
          href="https://www.google.com/maps?ll=38.880608,-77.167542&z=17&t=m&hl=en&gl=US&mapclient=embed&cid=7129841290350630658"
          className="link"
        >
          <address className="mb-2">
            Falls Church Presbyterian Church – Memorial Hall
            <br />
            225 E Broad St, Falls Church, VA 22046
          </address>
        </Link>

        <p className="mb-4">
          Our performance space is located in Memorial Hall, in the basement of
          the Falls Church Presbyterian Church, at{" "}
          <strong>225 E Broad St</strong>.
        </p>
        <h2 className="mb-2">Parking</h2>

        <p className="mb-4">
          Park in the front parking lot (facing Broad St) or side parking lot
          and follow the NOVA Nightsky signs until you see our sandwich board
          located at the top of the stairs to our performance space.
        </p>

        <h2 className="mb-2">Handicap Access</h2>

        <p className="mb-4">
          If you need handicap access, you must contact us beforehand so we can
          escort you into the building. Send an email to{" "}
          <Link href="mailto:novanightskytheater@gmail.com" className="link">
            novanightskytheater@gmail.com
          </Link>{" "}
          at least 24 hours before your scheduled performance.
        </p>

        <h2 className="mb-2">Little Food Pantry</h2>
        <p className="mb-2">
          Falls Church Presbyterian Church supports our local community in many
          ways, one of which is a Little Food Pantry. We are asking patrons to
          bring non-perishable items to keep the food pantry stocked this
          winter. Thank you for helping us support our new home and community.
        </p>
      </section>
      <section className="min-h-1/3 md:min-h-[auto] md:min-w-1/3">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?q=Falls+Church+Presbyterian+Church+Memorial+Hall+225+E+Broad+St,+Falls+Church,+VA+22046&key=${process.env.GOOGLE_MAPS_API_KEY}`}
          allowFullScreen
          loading="lazy"
          className="w-full h-full border-0"
        ></iframe>
      </section>
    </div>
  );
};

export default Page;
