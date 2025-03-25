import React from "react";
import classnames from "classnames";
import slugify from "@sindresorhus/slugify";

type Props = {
  name: string;
  title: string;
  children?: React.ReactNode;
};

const Person = ({ name, title, children }: Props) => {
  return (
    <section
      id={slugify(name)}
      className={classnames([
        "mb-6",
        "md:mb-10",
        "[&_p]:text-sm",
        "[&_p]:md:text-lg",
        "[&_p]:leading-normal",
        "[&_p]:mb-4",
        "[&_p:last-of-type]:mb-0",
      ])}
    >
      <h2 className="text-xl leading-tight mb-1 md:mb-0">{name}</h2>
      <h3 className="text-accent! mb-4 font-normal! normal-case! font-sans! leading-tight">
        {title}
      </h3>
      {children}
    </section>
  );
};

export default Person;
