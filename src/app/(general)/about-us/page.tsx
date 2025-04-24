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
    <div>
      <section className="mb-4 p-4 md:p-6 xl:p-8">
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
            className="w-full rounded-lg shadow-md mb-4 shadow-primary"
            src="/images/photographs/general/all-the-board.jpg"
            width="2930"
            height="1496"
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
            title="Producing Director / Co&#x2011;Founder / Actress"
            photosFolderId="f9121230e78c499bbc214a7faa968714"
          >
            <p>
              <EasterEgg>Jaclyn</EasterEgg> is a producer, actress, mom of
              three, and a serial entrepreneur. After graduating from the{" "}
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
            title="Design and Technical&nbsp;Director / Actor"
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
            title="Artistic&nbsp;Director / Actress / Director"
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
            title="Administrative&nbsp;Director / Actress / Director"
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
              <Link className="link" href="https://roadside.org/">
                Roadside Theater in Heidelberg
              </Link>
              . Elyse earned her BA in Theater and Arts Administration from{" "}
              <Link className="link" href="https://drew.edu/">
                Drew University
              </Link>
              , where she acted, directed, and served as chair of the dramatic
              society. She later earned an MA in Arts Management from{" "}
              <Link className="link" href="https://www.gmu.edu/">
                George Mason University.
              </Link>
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
      </section>
      <section className="">
        <div className="bg-info/60 p-4 md:p-6 xl:p-8">
          <h1 className="text-3xl">Company Members</h1>
        </div>
        <div
          className={classnames([
            "p-4 md:p-6 xl:p-8",
            "text-sm",
            "md:text-lg",
            "leading-tight",
          ])}
        >
          Theater is a team sport, and NOVA Nightsky relies on the hard work and
          dedication of volunteers to make our shows&nbsp;successful. Company
          Members are individuals who are tackling larger technical roles in our
          2025&nbsp;season.
        </div>
        <div className={classnames(["p-4", "md:p-6", "xl:p-8"])}>
          <Person
            name="Hannah Ruth Blackwell"
            title="Actor / Director / Playwright"
            photosFolderId="cad84141f3f745cfbb78efa1ed945eb7"
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
          <Person
            name="Fosse Thornton"
            title="Dancer / Actress"
            photosFolderId="26e8bbe1612b4b03b5d29169d8d2564c"
          >
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
      <section className="">
        <div className="bg-secondary/60 p-4 md:p-6 xl:p-8">
          <h1 className="text-3xl">Technical Crew</h1>
        </div>
        <div className={classnames(["p-4", "md:p-6", "xl:p-8"])}>
          <Person
            name="Nate Eagle"
            title="Webmaster / Actor"
            photosFolderId="62068bde83d34dc280bdc8b00c17b8f4"
          >
            <p>
              Nate Eagle is a software engineer, actor, and amateur mixologist.
              He&rsquo;s a proud alum of{" "}
              <Link className="link" href="https://www.sjc.edu/">
                St. John&rsquo;s College
              </Link>{" "}
              in Annapolis, Maryland&mdash;yeah, the weird Great Books
              school&mdash;where he studied liberal arts and philosophy.
              He&rsquo;s an avid{" "}
              <Link
                className="link"
                href="https://gokibitz.com/user/cloudbrows"
              >
                go player
              </Link>
              ,{" "}
              <Link
                className="link"
                href="https://nateeagle.com/tag/cocktails/"
              >
                cocktailer
              </Link>
              , and{" "}
              <Link
                className="link"
                href="https://nateeagle.com/posts/burns-supper/"
              >
                Robert Burns enthusiast
              </Link>
              . He acted in High School and college, then spent 21 years doing a
              bunch of other stuff. He returned to acting in 2024 and
              doesn&rsquo;t seem to be stopping any time soon.
            </p>
          </Person>
        </div>
      </section>
    </div>
  );
};

export default Page;
