import type { Metadata } from "next";
import React from "react";
import classnames from "classnames";
import wixClient from "@/lib/wixClient";
import type { Show } from "@/app/types";
import Person from "./Person";
import Link from "next/link";
import EasterEgg from "./EasterEgg";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about NOVA Nightsky Theater, our board members, our company members, and our technical crew.",
};

const Page = async () => {
  const now = new Date().toISOString();
  // Get shows whose openingDate is in the past
  const { items } = await wixClient.items
    .query("Shows")
    .lt("openingDate", now)
    .find();

  const shows = items as Show[];
  const numberOfProducedShows = shows.length;

  return (
    <div className="overflow-hidden">
      <section
        className={classnames([
          "mb-4",
          "p-4",
          "md:p-6",
          "xl:p-8",
          "overflow-hidden",
        ])}
      >
        <h1 className="text-2xl mb-4">About Us</h1>
        <div
          className={classnames(["md:grid", "md:grid-cols-[3fr_2fr]", "gap-8"])}
        >
          <div className={classnames(["mb-8", "md:mb-0"])}>
            <div className="">
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
                something a little different to the community.
              </p>
              <p
                className={classnames([
                  "text-sm",
                  "md:text-lg",
                  "mb-4",
                  "leading-tight",
                ])}
              >
                While our first show was performed outdoors in the height of the
                COVID-19 pandemic, we have performed {numberOfProducedShows}{" "}
                productions in all different types of venues aligning with our
                mission of producing theater in unconventional spaces. ​Unlike
                other community theater companies who rely on grants or
                donations to operate, we rely on ticket sales to produce our
                shows. As such, we maintain tight budgets and create shows
                utilizing the amazing talents of our company members
                and&nbsp;casts.
              </p>
            </div>
            <p
              className={classnames([
                "text-sm",
                "md:mt-4",
                "md:text-lg",
                "mb-4",
                "md:text-right",
                "leading-tight",
              ])}
            >
              Thank you for supporting us on this&nbsp;journey!
            </p>

            <p className="text-sm md:text-lg text-primary text-right">
              &mdash; NOVA Nightsky Theater&nbsp;Company
            </p>
          </div>

          <Image
            priority
            className="w-full rounded-lg shadow-md mb-4 shadow-primary"
            src="/images/photographs/general/2027-board.jpg"
            width="1536"
            height="1536"
            sizes="(max-width: 768px) 100vw, 40vw"
            alt="NOVA Nightsky's Board: Adam Ressa, Jaclyn Robertson, and Sarah Baczewski"
          />
        </div>
      </section>
      <section className="">
        <div className="bg-accent/60 p-4 md:p-6 xl:p-8">
          <h1 className="text-3xl">Board Members</h1>
        </div>
        <div className={classnames(["p-4", "md:p-6", "xl:p-8"])}>
          <Person
            name="Jaclyn Robertson"
            id="30f3d369-55e6-46ff-a77f-f7201fe29b58"
            title="Producing Director"
            subtitles={["Co-Founder", "Actress"]}
            photosFolderId="f9121230e78c499bbc214a7faa968714"
          >
            <p>
              <EasterEgg>Jaclyn Robertson</EasterEgg> is a producer, director,
              actress, and teaching artist, and the Co-founder and Producing
              Director of NOVA Nightsky Theater. She is a graduate of the{" "}
              <Link href="https://www.amda.edu/">
                American Musical and Dramatic Academy (AMDA)
              </Link>
              .
            </p>

            <p>
              Since returning to theater in 2017, Jaclyn has worked with{" "}
              <Link href="https://www.providenceplayers.org/">
                Providence Players of Fairfax
              </Link>
              ,{" "}
              <Link href="https://www.shoestringtheatrecompany.com/">
                Shoestring Theatre Company
              </Link>
              ,{" "}
              <Link href="https://www.fairfaxcitytheatre.org/">
                City of Fairfax Theatre Company
              </Link>
              ,{" "}
              <Link href="https://www.thelittletheatre.com/">
                Little Theatre of Alexandria
              </Link>
              , and{" "}
              <Link href="https://www.nextstoptheatre.org/">
                NextStop Theatre Company
              </Link>
              . In 2024, she joined NextStop as a Teaching Artist and currently
              serves as Director of the Stars on Stage program. In 2027, she
              will serve as NextStop&rsquo;s Interim Director of Education.
            </p>

            <p>
              Jaclyn founded NOVA Nightsky Theater in 2021 and serves as the
              company&rsquo;s Producing Director, overseeing its production
              operations, community outreach, and marketing. She brings her
              background as a small business owner to her work with NNS, with a
              particular focus on audience development and creating a supportive
              experience for the company&rsquo;s artists and production teams.
            </p>

            <p>
              As an artist and educator, Jaclyn is passionate about creating
              meaningful opportunities for people of all ages and experience
              levels to engage with theater, both onstage and behind the scenes.
            </p>
          </Person>
          <Person
            name="Adam Ressa"
            id="56eeb542-0b53-423d-83dc-f9f183adb531"
            title="Co-Technical Director"
            subtitles="Actor"
            photosFolderId="fee4187d32d04283aa0fe811e416387a"
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
              is an adequate assistant lighting&nbsp;designer.
            </p>
          </Person>
          <Person
            name="Sarah Baczewski"
            id="12b45679-e12a-4bcd-a6cb-098d86e7bbe3"
            title="Artistic Director"
            subtitles={["Actress", "Director"]}
            photosFolderId="4f9a71dd9d2e49f4a9792b5244b51cdd"
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
          </Person>
          <Person
            name="Elyse R. Smith"
            id="62151fb6-b85d-4de7-9508-a346d65c0262"
            title="Co-Technical Director"
            subtitles={["Actress", "Director"]}
            photosFolderId="3caf53af3db94a6e862b7f7b1d76f7a2"
          >
            <p className="mb-4">
              Elyse is an Army Brat who discovered theater while growing up in
              Germany. According to family legend, Art Club was canceled one
              afternoon, and her sister dragged her to Drama Club instead.
              Elyse—a professional introvert—was content to work backstage, but
              her dad insisted she try the spotlight.
            </p>

            <p className="mb-4">
              She spent her high school years doing shows with peers and at the{" "}
              <Link
                className="link"
                href="https://www.facebook.com/groups/2372221621/"
              >
                Roadside Theater in Heidelberg
              </Link>
              . Elyse earned her BA in Theater and Arts Administration from{" "}
              <Link className="link" href="https://drew.edu/">
                Drew University
              </Link>
              , where she acted, directed, and served as chair of the dramatic
              society. She later earned an MA in Arts Management from{" "}
              <Link className="link" href="https://www.gmu.edu/">
                George Mason University
              </Link>
              .
            </p>

            <p className="mb-4">
              After a decade-long hiatus from performing (her daughter was 10
              when she got back on stage—go ahead, do the math), Elyse returned
              to acting thanks to a spontaneous audition for NOVA Nightsky in
              2023. She hasn’t stopped pestering them since.
            </p>

            <p className="mb-4">
              Elyse enjoys acting, directing, designing, and cheering on her
              incredibly talented young thespian. By day, she works for the
              Smithsonian, where she champions unrestricted revenue and
              occasionally shakes down couches for loose change. She loves a
              good spreadsheet.
            </p>
          </Person>
        </div>
        <div className={classnames(["p-4", "md:p-6", "xl:p-8"])}>
          <Person
            name="Hannah Ruth Blackwell"
            id="3d7c8a3f-94e8-4219-95ec-268ac55d3687"
            slug="Hannah_Ruth-Blackwell"
            title="Administrative Director"
            subtitles={["Actress", "Director"]}
            photosFolderId="cad84141f3f745cfbb78efa1ed945eb7"
          >
            <p>
              Hannah Ruth Blackwell is an actor, director, and playwright
              hailing from the Blue Ridge Mountains of Virginia, and is a
              graduate of{" "}
              <Link href="https://www.american.edu/">American University</Link>{" "}
              with dual degrees in Musical Theatre and Music. As part of a very
              musical and theatrical family, she was in her first ever theater
              production at the age of three, and has been involved in the arts
              ever since! She has worked with NOVA Nightsky Theater many times
              since 2023 as a director, actor, sound designer, and stage
              manager, and is excited to join the board after a stint as a
              company member.
            </p>
            <p>
              When not in rehearsal, Hannah Ruth can be found creating order
              from chaos for fundraising teams at nonprofits (spreadsheets make
              the world go round!), or beading/embroidering/painting at home
              with her equally artistic wife and their two cats, both of whom
              love to “help” with any and all household artistic projects.
            </p>
          </Person>
          <Person
            name="Pilar Bruyere"
            id="3d7c8a3f-94e8-4219-95ec-268ac55d3687"
            title="Front of House Director"
            photosFolderId="05f94ac26a03481da8e45ecab703fca3"
          >
            <p>Crickets!</p>
          </Person>
          <Person
            name="Nate Eagle"
            id="4fc560a2-b4fa-46e2-89d2-db253361a0e9"
            title="Digital Operations Director"
            subtitles={["Actor", "Sound Designer"]}
            photosFolderId="62068bde83d34dc280bdc8b00c17b8f4"
          >
            <p>
              Nate Eagle is an actor, sound designer, webmaster, and general
              technical mischief-maker who came back to theater in 2024 after a
              twenty-year hiatus and has been making up for lost time ever
              since. At NOVA Nightsky, he has been lucky enough to do things he
              never expected to do in a theater: bring a radio station to life
              for The Gulf, fill an old CRT television with vintage Westerns and
              commercials for Fool for Love, and help bring the AI in
              Anthropology to life with sound, light, and a glowing illusion
              under glass. He also redesigned and rebuilt this very site because
              he had a dream about a website that had fireflies.
            </p>
            <p>
              By day, Nate is a software engineer at{" "}
              <Link href="https://leolabs.space/">LeoLabs</Link>, where he works
              on software for a network of radars tracking objects in low-Earth
              orbit. He is a graduate of{" "}
              <Link href="https://www.sjc.edu/">
                St. John’s College in Annapolis
              </Link>
              , where he studied liberal arts and philosophy.
            </p>
          </Person>
        </div>
      </section>
    </div>
  );
};

export default Page;
