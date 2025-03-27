"use client"; // if you're on Next.js 13 w/ app router, you may need this
import React, { useState } from "react";
import Link from "next/link";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import classnames from "classnames";
import { SiFacebook, SiInstagram } from "@icons-pack/react-simple-icons";

type Props = {
  seasons: string[];
};

const Navigation = ({ seasons }: Props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Auditions", href: "/auditions" },
    { label: "About Us", href: "/about-us" },
    { label: "Work with Us", href: "/work-with-us" },
    { label: "Box Office", href: "/box-office" },
    {
      label: <SiFacebook />,
      href: "https://www.facebook.com/novanightskytheater/",
    },
    {
      label: <SiInstagram />,
      href: "https://www.instagram.com/novanightskytheater/",
    },
  ];

  // For desktop, we keep using a dropdown
  const SeasonsDropdownDesktop = () => {
    return (
      <li className="dropdown dropdown-hover dropdown-center">
        <label role="button" className="cursor-pointer">
          Seasons
        </label>

        <ul
          className={classnames([
            "dropdown-content",
            "menu",
            "m-0!",
            "bg-base-200/90",
            "p-2",
            "shadow",
            "z-10",
            "rounded-b",
          ])}
        >
          {seasons.map((season) => (
            <li key={season}>
              <Link href={`/seasons/${season}`}>{season}</Link>
            </li>
          ))}
        </ul>
      </li>
    );
  };

  return (
    <nav className="navbar p-0 min-h-0 text-primary">
      {/* Left side (mobile hamburger + optional logo) */}
      <div className="navbar-start">
        {/* Mobile menu toggle button (hidden on large screens) */}
        <button
          className="btn btn-ghost lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Desktop menu (hidden on mobile) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0 text-sm font-bold">
          <SeasonsDropdownDesktop />
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side (if needed) */}
      <div className="navbar-end">{/* e.g. <button>Login</button> */}</div>

      {/* Mobile menu (shows up when toggled) */}
      {isMobileMenuOpen && (
        <ul
          className={classnames([
            "menu",
            "menu-compact",
            "absolute",
            "top-full",
            "right-0",
            "rounded",
            "bg-base-300/95",
            "p-2",
            "shadow-lg",
            "lg:hidden",
            "mt-2",
            "z-50",
          ])}
        >
          {/* Seasons accordion item */}
          <li className="collapse collapse-arrow">
            <input
              type="checkbox"
              className={classnames(["p-0!", "px-0!", "min-h-0!"])}
            />
            {/* The clickable header for the accordion */}
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
              Seasons
            </div>
            {/* The content that expands */}
            <ul className="collapse-content ml-0 p-0 pl-2 pb-0! before:hidden">
              {seasons.map((season) => (
                <li key={season}>
                  <Link
                    href={`/seasons/${season}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {season}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Other nav links on mobile */}
          {navLinks.map(({ label, href }) => {
            return (
              <li key={href} className={classnames(["font-bold"])}>
                <Link href={href} onClick={() => setIsMobileMenuOpen(false)}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
};

export default Navigation;
