import React from "react";
import Link from "next/link";
import classnames from "classnames";

type Props = {
  seasons: string[];
};

const Navigation = async ({ seasons }: Props) => {
  return (
    <ul className="menu menu-horizontal m-0 p-0 text-sm font-bold">
      <li className="dropdown dropdown-hover dropdown-center">
        <div tabIndex={0} role="button" className="">
          Seasons
        </div>
        <ul
          tabIndex={0}
          className={classnames([
            "dropdown-content",
            "menu",
            "m-0!",
            "z-1",
            "bg-base-200",
          ])}
        >
          {seasons.map((season) => (
            <li key={season}>
              <Link href={`/seasons/${season}`}>{season}</Link>
            </li>
          ))}
        </ul>
      </li>
      <li>
        <Link href="/auditions">Auditions</Link>
      </li>
      <li>
        <Link href="/about-us">About Us</Link>
      </li>
      <li>
        <Link href="/work-with-us">Work with us</Link>
      </li>
      <li>
        <Link href="/box-office">Box Office</Link>
      </li>
    </ul>
  );
};

export default Navigation;
