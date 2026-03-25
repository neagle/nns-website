"use server";
import { wixApiClient } from "@/lib/wixClient";
import type { WixDataItem } from "@wix/wix-data-items-sdk";

export interface Person {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface NewCredit {
  person: string;
  show: string;
  category: "cast" | "crew";
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

// Insert people individually so we get each item's _id back.
// bulkInsert only returns counts — no IDs — so we can't link credits after it.
export const addPeople = async ({
  people,
}: {
  people: Person[];
}): Promise<WixDataItem[]> => {
  const inserted = await Promise.all(
    people.map((person) => wixApiClient.items.insert("People", person))
  );
  return inserted;
};

export const addCredits = async ({ credits }: { credits: NewCredit[] }) => {
  // Wix reference fields expect { _id: "..." } objects, not bare ID strings.
  const creditItems = credits.map(({ person, show, category }) => ({
    person: { _id: person },
    show: { _id: show },
    category,
  }));
  const result = await wixApiClient.items.bulkInsert("Credits", creditItems);
  if (result.errors?.length) {
    throw new Error(
      `Failed to insert ${result.errors.length} credit(s): ${result.errors
        .map((e) => e.message)
        .join(", ")}`
    );
  }
  return result;
};
