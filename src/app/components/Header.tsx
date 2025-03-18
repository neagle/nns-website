import React from "react";
import type { Show } from "@/app/types";
import Nightsky from "@/app/components/Nightsky";
import Logo from "@/app/components/Logo";
import Navigation from "@/app/components/Navigation";
import wixClient from "@/lib/wixClient";
import dayjs from "dayjs";
import Link from "next/link";

const Header = async () => {
  const { items } = await wixClient.items
    .query("Shows")
    .descending("openingDate")
    .find();
  const shows = items as Show[];

  const seasons = shows.reduce((acc, show) => {
    const year = dayjs(show.openingDate).format("YYYY");
    if (!acc.includes(year)) {
      acc.push(year);
    }
    return acc;
  }, [] as string[]);

  return (
    <header className="">
      <Nightsky fireflies={true}>
        <div className="navbar p-0 min-h-[auto] items-center">
          <div className="flex-1 leading-1">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="flex-none">
            <Navigation seasons={seasons} />
          </div>
        </div>
      </Nightsky>
    </header>
  );
};

export default Header;
