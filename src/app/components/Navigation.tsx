"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import classnames from "classnames";
import { SiFacebook, SiInstagram } from "@icons-pack/react-simple-icons";

type Props = {
  seasons: string[];
};

interface navItem {
  label: string | React.ReactNode;
  href?: string;
  children?: navItem[];
  highlight?: boolean;
}

const Navigation = ({ seasons }: Props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: navItem[] = [
    {
      label: "Shows",
      children: seasons.map((season) => {
        const currentSeason = season === new Date().getFullYear().toString();
        return {
          label: `${season}${currentSeason ? " Season" : ""}`,
          href: `/seasons/${season}`,
          highlight: currentSeason,
        };
      }),
    },
    {
      label: "Tickets",
      children: [
        { label: "Box Office", href: "/box-office" },
        { label: "Become a Subscriber", href: "/box-office/subscriptions" },
        { label: "Show Participants", href: "/box-office/participant" },
      ],
    },
    {
      label: "Get Involved",
      children: [
        { label: "Auditions", href: "/auditions" },
        { label: "Work With Us", href: "/work-with-us" },
        { label: "Support Us", href: "/support-us" },
      ],
    },
    {
      label: "About",
      children: [
        { label: "About Us", href: "/about-us" },
        { label: "Our Venue", href: "/venue" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      label: <SiFacebook />,
      href: "https://www.facebook.com/novanightskytheater/",
    },
    {
      label: <SiInstagram />,
      href: "https://www.instagram.com/novanightskytheater/",
    },
  ];

  const renderDesktopItem = (item: (typeof navItems)[number]) => {
    if (item.children) {
      return (
        <li
          key={item.label?.toString()}
          className="dropdown dropdown-hover dropdown-center"
        >
          <label role="button" className={classnames(["cursor-auto"])}>
            {item.label}
          </label>
          <ul
            className={classnames([
              "dropdown-content",
              "menu",
              "m-0!",
              "bg-base-200/90",
              "p-2",
              "shadow-lg",
              "z-10",
              "rounded",
            ])}
          >
            {item.children.map((child) => (
              <li
                key={child.href}
                className={classnames({
                  "font-normal": !child?.highlight,
                })}
              >
                {child.href ? (
                  <Link
                    href={child.href}
                    className={classnames([
                      "whitespace-nowrap",
                      { "font-bold": child.highlight },
                    ])}
                  >
                    {child.label}
                  </Link>
                ) : (
                  <span>{child.label}</span>
                )}
              </li>
            ))}
          </ul>
        </li>
      );
    }
    return (
      <li key={item.href} className={classnames([])}>
        <Link href={item.href!} className={classnames(["whitespace-nowrap"])}>
          {item.label}
        </Link>
      </li>
    );
  };

  const renderMobileItem = (item: (typeof navItems)[number]) => {
    if (item.children) {
      return (
        <li className="collapse collapse-arrow" key={item.label?.toString()}>
          <input
            type="checkbox"
            className={classnames(["p-0!", "px-0!", "min-h-0!"])}
          />
          <div
            className={classnames([
              "collapse-title",
              "font-bold",
              "p-0",
              "px-3",
              "py-1",
              "min-h-0",
              "after:top-[50%]!",
            ])}
          >
            {item.label}
          </div>
          <ul className="collapse-content ml-0 p-0 pl-2 pb-0! before:hidden">
            {item.children.map((child) => (
              <li
                key={child.href}
                className={classnames([
                  "whitespace-nowrap",
                  { "font-bold": child.highlight },
                ])}
              >
                {child.href ? (
                  <Link
                    href={child.href}
                    className={classnames([
                      "whitespace-nowrap",
                      { "font-bold": child.highlight },
                    ])}
                  >
                    {child.label}
                  </Link>
                ) : (
                  <span>{child.label}</span>
                )}
              </li>
            ))}
          </ul>
        </li>
      );
    }

    return (
      <li key={item.href} className="font-bold">
        <Link href={item.href!} onClick={() => setIsMobileMenuOpen(false)}>
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <nav className="navbar p-0 min-h-0 text-primary">
      {/* Left: Mobile hamburger */}
      <div className="navbar-start">
        <button
          className="btn btn-ghost lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
        >
          {isMobileMenuOpen ? (
            <CloseIcon />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          )}
        </button>
      </div>

      {/* Center: Desktop nav */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0 text-sm font-bold">
          {navItems.map(renderDesktopItem)}
        </ul>
      </div>

      {/* Right: optional buttons */}
      <div className="navbar-end">{/* Optional right-side content */}</div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div
          className={classnames([
            "absolute",
            "top-full",
            "right-0",
            "mt-2",
            "z-50",
            "bg-base-300/95",
            "p-2",
            "shadow-lg",
            "rounded",
            "lg:hidden",
          ])}
        >
          <ul className="menu menu-compact p-0">
            {(() => {
              const result: React.ReactNode[] = [];

              for (let i = 0; i < navItems.length; i++) {
                const item = navItems[i];

                result.push(renderMobileItem(item));
              }

              return result;
            })()}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
