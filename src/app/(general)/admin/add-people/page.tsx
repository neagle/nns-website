import React from "react";
import Link from "next/link";
import { getShows } from "@/app/actions/shows";
import AddPeopleForm from "./AddPeopleForm";

export const dynamic = "force-dynamic";

const AddPeoplePage = async () => {
  const shows = await getShows();

  return (
    <div className="p-4 md:p-6 xl:p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-base-content/50 hover:text-base-content transition-colors">
          ← Admin
        </Link>
      </div>
      <h1 className="mb-6">Add People</h1>
      <AddPeopleForm shows={shows} />
    </div>
  );
};

export default AddPeoplePage;
