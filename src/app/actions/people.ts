"use server";
import wixApiClient from "@/lib/wixClient";

// This is some obviously in-progress work on creating admin functionality to
// make it easier to add people to the CMS.

export interface Person {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export const getPeople = async ({ people }: { people: Person[] }) => {
  let query = wixApiClient.items.query("People");

  if (people.length === 1) {
    // Just one person: use .eq for each field
    const { firstName, lastName, middleName } = people[0];
    query = query.eq("firstName", firstName).eq("lastName", lastName);
    if (middleName !== undefined) {
      query = query.eq("middleName", middleName);
    }
  } else if (people.length > 1) {
    // Multiple people: build a chain of .or() with filter builders
    let orQuery = null;
    for (const person of people) {
      let personQuery = wixApiClient.items
        .query("People")
        .eq("firstName", person.firstName)
        .eq("lastName", person.lastName);
      if (person.middleName !== undefined) {
        personQuery = personQuery.eq("middleName", person.middleName);
      }
      orQuery = orQuery ? orQuery.or(personQuery) : personQuery;
    }
    query = orQuery!;
  }

  const { items } = await query.find();
  return items;
};

export const addPeople = async ({ people }: { people: Person[] }) => {
  // console.log("wixApiClient", wixApiClient);
  // console.log("verifying presence of correct env vars");
  // console.log("WIX_API_KEY", process.env.WIX_API_KEY);
  // console.log("WIX_SITE_ID", process.env.WIX_SITE_ID);
  // console.log("WIX_ACCOUNT_ID", process.env.WIX_ACCOUNT_ID);
  const result = await wixApiClient.items.bulkInsert("People", people);
  return result;
};
