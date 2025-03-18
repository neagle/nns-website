"use client"; // if you're on Next.js 13 w/ app router, you may need this
import React, { useState } from "react";
import Link from "next/link";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

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
  ];

  // For desktop, we keep using a dropdown
  const SeasonsDropdownDesktop = () => (
    <li className="dropdown dropdown-hover dropdown-center">
      <label tabIndex={0} role="button" className="cursor-pointer">
        Seasons
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-200 p-2 shadow z-10"
      >
        {seasons.map((season) => (
          <li key={season}>
            <Link href={`/seasons/${season}`}>{season}</Link>
          </li>
        ))}
      </ul>
    </li>
  );

  return (
    <nav className="navbar bg-base-100">
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
            <li key={label}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side (if needed) */}
      <div className="navbar-end">{/* e.g. <button>Login</button> */}</div>

      {/* Mobile menu (shows up when toggled) */}
      {isMobileMenuOpen && (
        <ul className="menu menu-compact absolute top-full left-0 w-full bg-base-100 p-2 shadow lg:hidden">
          {/* Seasons accordion item */}
          <li className="collapse collapse-arrow border border-base-200 rounded-box">
            <input type="checkbox" />
            {/* The clickable header for the accordion */}
            <div className="collapse-title font-bold">Seasons</div>
            {/* The content that expands */}
            <ul className="collapse-content pl-4">
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
          {navLinks.map(({ label, href }) => (
            <li key={label} className="font-bold">
              <Link href={href} onClick={() => setIsMobileMenuOpen(false)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navigation;
