import React from "react";
import AddPeople from "./AddPeople";
import classnames from "classnames";

export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <div className="p-4 md:p-6 xl:p-8">
      <h1>Admin</h1>
      <AddPeople />
    </div>
  );
};

export default Page;
