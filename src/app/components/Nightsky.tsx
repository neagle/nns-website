import React from "react";
import classnames from "classnames";
import Sky from "@/app/components/Sky";
import Fireflies from "@/app/components/Fireflies";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Nightsky = ({ children, className = "" }: Props) => {
  return (
    <div className={classnames(className, ["p-7", "relative", "bg-gray-900"])}>
      <Sky />
      <div className="relative">{children}</div>
      <Fireflies />
    </div>
  );
};

export default Nightsky;
