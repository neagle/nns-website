import React from "react";
import Link from "next/link";
import { fullName, nameSlug } from "@/app/utils";

interface Props {
  people: {
    _id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
  }[];
  linkToCredits?: boolean;
  serialize?: boolean;
}

const PersonList = ({
  people,
  linkToCredits = false,
  serialize = true,
}: Props) => {
  return (
    <>
      {people.map((person, index) => (
        <React.Fragment key={person._id}>
          {linkToCredits ? (
            <Link
              href={`/credits/${nameSlug(person)}/${person._id}`}
              className="link"
            >
              {fullName(person)}
            </Link>
          ) : (
            <span>{fullName(person)}</span>
          )}
          {/* If there are two people, add "and" between their names */}
          {serialize && index === 0 && people.length === 2 && " and "}
          {/* If there are more than two people, add commas between their names, and "and" before the last name */}
          {serialize &&
            people.length !== 2 &&
            index < people.length - 2 &&
            ", "}
          {serialize &&
            people.length !== 2 &&
            index === people.length - 2 &&
            ", and "}
        </React.Fragment>
      ))}
    </>
  );
};

// Accept the same props as the component, minus the linkToCredits prop
// Return an optionally serialized string of names
export const getPersonList = ({
  people,
  serialize = true,
}: Omit<Props, "linkToCredits">) => {
  if (!serialize) {
    return people.map(fullName).join(" ");
  }

  // If there is one person, return their full name
  if (people.length === 1) {
    return fullName(people[0]);
  }
  // If there are two people, return "Name1 and Name2"
  if (people.length === 2) {
    return `${fullName(people[0])} and ${fullName(people[1])}`;
  }
  // If there are more than two people, return "Name1, Name2, and Name3"
  return `${people.slice(0, -1).map(fullName).join(", ")}, and ${fullName(
    people[people.length - 1]
  )}`;
};

export default PersonList;
