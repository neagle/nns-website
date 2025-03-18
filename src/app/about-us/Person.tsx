import React from "react";

type Props = {
  name: string;
  title: string;
  children?: React.ReactNode;
};

const Person = ({ name, title, children }: Props) => {
  return (
    <section className="mb-10 [&_p]:leading-normal [&_p]:mb-4">
      <h2 className="text-xl">{name}</h2>
      <h3 className="text-accent! mb-4 font-normal! normal-case! font-sans!">
        {title}
      </h3>
      {children}
    </section>
  );
};

export default Person;
