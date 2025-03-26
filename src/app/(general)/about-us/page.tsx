import React from "react";
import classnames from "classnames";
import wixClient from "@/lib/wixClient";
import type { Show } from "@/app/types";
import Person from "./Person";
import Nightsky from "@/app/components/Nightsky";
import Link from "next/link";

const Page = async () => {
  const now = new Date().toISOString();
  // Get shows whose openingDate is in the past
  const { items } = await wixClient.items
    .query("Shows")
    .lt("openingDate", now)
    .find();

  const shows = items as Show[];
  // console.log("shows", shows);
  const numberOfProducedShows = shows.length;

  return (
    <div>
      <section className="mb-4 p-4">
        <h1 className="text-xl mb-4">About Us</h1>
        <Nightsky
          className={classnames(
            "rounded-lg",
            "overflow-hidden",
            "shadow-md",
            "shadow-accent",
            "p-2!",
            "md:p-4!"
          )}
        >
          <div
            className={classnames([
              "m-2",
              "mb-0",
              "rounded-lg",
              "overflow-hidden",
            ])}
          >
            <div className="md:columns-2 drop-shadow-lg!">
              <p
                className={classnames([
                  "text-sm",
                  "md:text-lg",
                  "mb-4",
                  "leading-tight",
                ])}
              >
                <span className="font-bold text-accent uppercase">
                  NOVA Nightsky Theater
                </span>{" "}
                was founded in later summer of 2021 by actor / producer{" "}
                <strong className="text-primary">Jaclyn Robertson</strong> and
                playwright / director{" "}
                <strong className="text-primary">Ward Kay</strong>. Both had
                worked in the local theater scene for years but wanted to bring
                something a little different to the community. While our first
                show was performed outdoors in the height of the COVID-19
                pandemic, we have performed {numberOfProducedShows} productions
                in all different types of venues aligning with our mission of
                producing theater in unconventional spaces. ​Unlike other
                community theater companies who rely on grants or donations to
                operate, we rely on ticket sales to produce our shows. As such,
                we maintain tight budgets and create shows utilizing the amazing
                talents of our company members and&nbsp;casts.
              </p>
            </div>
            <p className="text-sm md:mt-4 md:text-lg mb-4 md:text-right leading-tight">
              Thank you for supporting us on this&nbsp;journey!
            </p>

            <p className="text-sm md:text-lg text-primary text-right">
              &mdash; NOVA Nightsky Theater&nbsp;Company
            </p>
          </div>
        </Nightsky>
      </section>
      <section className="grid md:grid-cols-[1fr_2fr] gap-4 mb-4">
        <div className="bg-accent/60 p-4">
          <h1 className="text-3xl md:text-right">Board Members</h1>
        </div>
        <div className={classnames(["p-4"])}>
          <Person
            name="Jaclyn Robertson"
            title="Producing Director / Co-Founder / Actress"
          >
            <p>
              Jaclyn is a producer, actress, mom of three, and a serial
              entrepreneur. After graduating from the{" "}
              <Link className="link" href="https://www.amda.edu/">
                American Musical and Dramatic Academy
              </Link>
              , she took a long hiatus from the theater to raise her three young
              children and spent a decade running a successful fitness business
              for mothers. Since 2017 Jaclyn has worked at{" "}
              <Link className="link" href="https://www.providenceplayers.org/">
                Providence Players of Fairfax
              </Link>
              ,{" "}
              <Link
                className="link"
                href="https://www.shoestringtheatrecompany.com/"
              >
                Shoestring Theatre Company
              </Link>
              ,{" "}
              <Link className="link" href="https://www.fairfaxcitytheatre.org/">
                City of Fairfax Theater Company
              </Link>
              , and{" "}
              <Link className="link" href="https://thelittletheatre.com/">
                Little Theater of Alexandria (LTA)
              </Link>
              . In 2024 she began working as a Teaching Artist for{" "}
              <Link className="link" href="https://www.nextstoptheatre.org/">
                NextStop Theater Company
              </Link>
              .
            </p>
            <p>
              As our Producing Director, Jaclyn brings her expertise as a small
              business owner to NOVA Nightsky by focusing on community outreach,
              marketing/branding, and making sure our crews and casts have
              everything they need to feel supported.
            </p>
          </Person>
          <Person
            name="Adam Ressa"
            title="Design and Technical Director / Actor"
          >
            <p className="mb-4">
              Adam has held a variety of creative and technical roles in
              multiple industries, including exhibits, theatrical experiences,
              and immersive theme parks. He graduated from{" "}
              <Link className="link" href="https://www.vt.edu/">
                Virginia Tech
              </Link>{" "}
              with dual degrees in Industrial & Systems Engineering and Theatre
              Arts. While attending VT he founded a school sponsored
              performance-based multi-media organization, and took on side
              projects with theaters and creative organizations all over VA.
            </p>
            <p className="mb-4">
              In 2010, his desire to tell immersive stories brought him to
              Orlando where he joined{" "}
              <Link
                className="link"
                href="https://sites.disney.com/waltdisneyimagineering/"
              >
                Walt Disney Imagineering
              </Link>{" "}
              - the creative arm for Disney&rsquo;s Parks and Resorts. Adam also
              served as a freelance scenographer and technical production
              manager for various theater organizations in central FL.
            </p>
            <p>
              In 2017, Adam returned to the DMV and began working in the museum
              industry, creating content-based exhibits for the National Parks
              Service as well as other public and private institutions. He has
              worked for the Smithsonian as a Visual Information Specialist for
              the{" "}
              <Link href="https://npg.si.edu/" className="link">
                National Portrait Gallery
              </Link>
              , and is currently working at the Exhibits Specialist at the U.S.
              Capitol.
            </p>
            <p>
              His infant son{" "}
              <span
                className="tooltip underline underline-offset-4 decoration-dotted"
                data-tip="👖"
              >
                Levi
              </span>{" "}
              is an adequate assistant lighting designer.
            </p>
          </Person>
          <Person
            name="Sarah Baczewski"
            title="Administrative Director / Actress / Director"
          >
            <p className="mb-4">
              Sarah Baczewski is a director, stage manager and (occasional)
              actress. A Washington State native, Sarah is a recent transplant
              (via Los Angeles, CA) to the Washington, DC area. She has directed
              productions for{" "}
              <Link className="link" href="https://www.providenceplayers.org/">
                Providence Players of Fairfax
              </Link>{" "}
              and NOVA Nightsky Theater, as well as a radio play for{" "}
              <Link
                className="link"
                href="https://www.thearlingtonplayers.org/"
              >
                The Arlington Players (TAP)
              </Link>
              . She fell in love with community theatre at age 12 and majored in
              theatre at{" "}
              <Link className="link" href="https://www.whitman.edu/">
                Whitman College
              </Link>
              . Following a 12+ year career in the entertainment industry, she
              shifted to the nonprofit space three years ago and currently works
              in fund development for a nonprofit focused on D.C. legal system
              reform.
            </p>

            <p>
              As Administrative Director, Sarah handles scheduling, logistical
              coordination, and other support for NOVA Nightsky&rsquo;s
              productions.
            </p>
          </Person>
        </div>
      </section>
      <section className="grid md:grid-cols-[1fr_2fr] gap-4 mb-4">
        <div className="bg-info/60 p-4 ">
          <h1 className="text-3xl md:text-right">Company Members</h1>
          <div
            className={classnames([
              "text-sm",
              "text-info-content",
              "[&>p]:text-right [&>p]:leading-tight [&>p]:mb-4",
            ])}
          ></div>
        </div>
        <div className="p-4">
          <div className="alert alert-info mb-4 text-neutral">
            Theater is a team sport, and NOVA Nightsky relies on the hard work
            and dedication of volunteers to make our shows&nbsp;successful.
            Company Members are individuals who are tackling larger technical
            roles in our 2025&nbsp;season.
          </div>
          <Person
            name="Hannah Ruth Blackwell"
            title="Actor / Director / Playwright"
          >
            <p>
              Hannah Ruth Blackwell is an actor, director, and playwright
              hailing from the Blue Ridge Mountains of Virginia, and is a
              graduate of{" "}
              <Link className="link" href="https://www.american.edu/">
                American University
              </Link>{" "}
              with dual degrees in Musical Theatre and Music. She was in her
              first theater production at the age of 3, and has been involved in
              theater ever since! She has been involved with NOVA Nightsky
              Theater in both a directing and acting capacity, and is excited to
              join the team as a company member. When not in rehearsal, Hannah
              Ruth can be found fundraising for nonprofit organizations, or at
              home with her wife and their two cats.
            </p>
          </Person>
          <Person name="Fosse Thornton" title="Dancer / Actress">
            <p>
              Fosse is an actor / dancer / singer born and raised in Northern
              Virginia. She loves the classics-with-an-in-your-face-twist, and
              has found that NOVA Nightsky is the perfect place to work on some
              real good theater with an incredibly talented and passionate team.
              When she&rsquo;s not onstage, you can find her at the skatepark or
              in a dance class. Thanks to Jaclyn, Adam, Sarah and the whole team
              for the laughs and artistry&mdash;and cheers to many more.
            </p>
          </Person>
        </div>
      </section>
      <section className="grid md:grid-cols-[1fr_2fr] gap-4">
        <div className="bg-secondary/60 p-4">
          <h1 className="text-3xl md:text-right">Technical Crew</h1>
        </div>
        <div className="p-4">
          <Person name="Nate Eagle" title="Webmaster / Actor">
            <p>
              Nate Eagle is a software engineer, actor, and amateur mixologist.
              He&rsquo;s a proud alum of{" "}
              <Link className="link" href="https://www.sjc.edu/">
                St. John&rsquo;s College
              </Link>{" "}
              in Annapolis, Maryland, the weird Great Books school, where he
              studied liberal arts and philosophy. A Washington State native,
              he&rsquo;d still call soda &ldquo;pop&rdquo; if he could get away
              with it. He returned to acting in 2024 after 21 years away and has
              no intention of stopping.
            </p>
          </Person>
        </div>
      </section>
    </div>
  );
};

export default Page;
