import React from "react";
import classnames from "classnames";
import Sky from "@/app/components/Sky";
import Fireflies from "@/app/components/Fireflies";

type Props = {
  children: React.ReactNode;
  className?: string;
  fireflies?: boolean;
};

const Nightsky = ({ children, className = "", fireflies = false }: Props) => {
  return (
    <div className={classnames(className, ["p-4", "relative", "bg-gray-900"])}>
      <Sky />
      <div className="relative">{children}</div>
      {fireflies && <Fireflies />}
    </div>
  );
};

export default Nightsky;
