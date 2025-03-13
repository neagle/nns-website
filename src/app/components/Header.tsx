import React from "react";
import wixClient from "@/lib/wixClient";
import { Show } from "@/app/types";
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
  console.log("seasons", seasons);

  return (
    <header>
      <menu>
        <ul>
          <li>
            Seasons
            <ol>
              {seasons.map((season) => (
                <li key={season}>
                  <Link href={`/seasons/${season}`}>{season}</Link>
                </li>
              ))}
            </ol>
          </li>
        </ul>
      </menu>
    </header>
  );
};

export default Header;
