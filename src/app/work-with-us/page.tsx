import React from "react";
import Link from "next/link";
import classnames from "classnames";

const Page = () => {
  return (
    <div
      className={classnames([
        "p-4",
        "md:w-3/4",
        "[&_h1]:text-2xl",
        "[&_h2]:text-xl",
        "[&_h2]:mb-4",
        "[&_p]:md:text-lg",
        "[&_p]:mb-4",
        "[&_ul]:mb-4",
        "[&_li]:list-disc",
        "[&_li]:ml-4",
        "[&_li]:leading-tight",
        "[&_li]:mb-2",
        "[&_li]:md:text-lg",
        "[&_li_strong]:text-info",
      ])}
    >
      <h1 className="mb-4">Work With Us</h1>

      <h2>Show Submissions</h2>

      <p>Our selection process:</p>

      <p>
        We spend the fall and winter reading plays. Lots of plays. In the
        spring, we start putting together a theme for the season. In 2024, our
        theme is “Dysfunctional Families.” In 2023, our theme was “Connections.”
        In early summer, we secure the rights and directors. We typically
        announce each August.
      </p>

      <p>Things to consider when submitting a show to us:</p>

      <h2>Our Values</h2>

      <ul>
        <li>
          <strong>Female Forward:</strong> We gravitate towards plays that
          feature strong and intriguing female characters and give a plethora of
          performance opportunities for women of all backgrounds, races,
          ethnicities, and ages.
        </li>

        <li>
          <strong>Representing Our Community:</strong> The DMV is full of ALL
          KINDS of people. We want to see that wonderful diversity in the shows
          we produce.
        </li>

        <li>
          <strong>Performance Based:</strong> Outstanding performances are our
          foremost priority. Design and technical elements supplement the
          performers, but do not steal focus.
        </li>

        <li>
          <strong>Honoring &ldquo;classics&rdquo;:</strong> We have a special
          place in our hearts for shows that have stood the test of time because
          of their universal themes. From Shakespeare to Tennessee Williams,
          each year we try to produce at least one show that has a reputation
          for critical acclaim.
        </li>

        <li>
          <strong>Celebrating New/Modern Voices:</strong> Each year we try to
          produce a relatively unknown (or non mainstream) show by a living
          playwright.
        </li>

        <li>
          <strong>Respecting the Small Team:</strong> We have a small leadership
          team. Any technical or design related assistance is relatively
          limited. While it may constrain the technical scopes of our
          productions, we prefer it. It keeps us agile, adaptable, and
          efficient.
        </li>

        <li>
          <strong>Fostering Growth Through Relationships:</strong> We believe in
          investing back in the people who support us. Please consider
          volunteering with us!
        </li>
      </ul>

      <h2>Our Venues</h2>

      <ul>
        <li>
          We prefer intimate venues that typically have between 25 and 99 seats.
        </li>

        <li>
          Technical elements should be simple, such as a single location set, OR
          modular, where the setting can be conveyed with a few pieces of
          furniture. We typically have to share the venues with other groups,
          which requires us to load in and out specific technical elements
          before and after each show OR at the beginning and end of each weekly
          show run.
        </li>

        <li>The size of the cast should be proportional to the space.</li>

        <li>
          Musical proposals: Most of our venues only lend themselves to 1
          &ndash; 2 musicians at most.
        </li>
      </ul>

      <p>Please consider these as suggested guidelines, NOT REQUIREMENTS.</p>

      <p>
        Submit plays and musicals for consideration to:{" "}
        <Link
          className="link break-words"
          href="mailto:artisticdirector.novanightsky@gmail.com"
        >
          artisticdirector.novanightsky@gmail.com
        </Link>
        .
      </p>

      <h2>Let&rsquo;s Work Together</h2>
      <p>
        We are always looking for volunteers & interns (unpaid) in a variety of
        roles.
      </p>

      <ul>
        <li>House Management</li>

        <li>Lighting & Sound Design, Board Operators, &amp; Crew</li>

        <li>Props, Set Decor &amp; Scenic Design</li>

        <li>Special FX & Projections</li>

        <li>Stage Management &amp; Run Crew</li>

        <li>Assistant Director</li>
      </ul>

      <p>
        We take pride in setting our team members up for success and we strive
        to cultivate the creativity of each individual involved in our
        productions.
      </p>

      <p>
        If you&rsquo;re interested in volunteering with us, please{" "}
        <Link className="link" href="/contact">
          contact us
        </Link>
        .
      </p>
    </div>
  );
};

export default Page;
