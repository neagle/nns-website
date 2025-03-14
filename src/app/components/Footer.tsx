import React from "react";
import classnames from "classnames";

const Footer = () => {
  return (
    <footer
      className={classnames([
        "footer",
        "sm:footer-horizontal",
        "bg-neutral",
        "text-neutral-content",
        "p-8",
        "border-t-8",
        "border-primary",
      ])}
    >
      <aside className="uppercase tracking-wider">
        &copy; NOVA Nightsky Theater
      </aside>
    </footer>
  );
};

export default Footer;
