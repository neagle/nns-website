import type { Show, Credit } from "@/app/types";
import wixClient from "@/lib/wixClient";

type Props = {
  shows: Show[];
  onlyUpcoming?: boolean;
};

const sortCreditsByPerson = (credits: Credit[]) => {
  const creditsByPerson: Record<string, Credit[]> = {};
  credits.forEach((credit) => {
    const personId = credit.person._id;
    if (!creditsByPerson[personId]) {
      creditsByPerson[personId] = [];
    }
    creditsByPerson[personId].push(credit);
  });

  const sortedCredits = [];
  for (const personId in creditsByPerson) {
    sortedCredits.push(creditsByPerson[personId]);
  }

  // console.log("sortedCredits", sortedCredits);

  return sortedCredits.sort((a, b) => {
    const aCredit = a[0];
    const bCredit = b[0];
    const manualSortKeyName = /^_manualSort/;
    const aSortKey = Object.keys(aCredit).find((key) =>
      manualSortKeyName.test(key)
    );
    const bSortKey = Object.keys(aCredit).find((key) =>
      manualSortKeyName.test(key)
    );
    // @ts-expect-error - ts doesn't know that aSortKey and bSortKey are keys of aCredit and bCredit
    const aSortValue = aSortKey && aSortKey in aCredit ? aCredit[aSortKey] : "";
    // @ts-expect-error - ts doesn't know that aSortKey and bSortKey are keys of aCredit and bCredit
    const bSortValue = bSortKey && bSortKey in bCredit ? bCredit[bSortKey] : "";
    return aSortValue.localeCompare(bSortValue);
  });
};

export const getShowsWithData = async ({
  shows,
  onlyUpcoming = true,
}: Props) => {
  "use server";

  const showsWithData = await Promise.all(
    shows.map(async (show: Show) => {
      const castQuery = wixClient.items
        .query("Credits")
        .eq("show", show._id)
        .eq("category", "cast")
        .include("person")
        .ascending("order");

      const crewQuery = wixClient.items
        .query("Credits")
        .eq("show", show._id)
        .eq("category", "crew")
        .include("person")
        .ascending("order");

      let showsQuery = wixClient.wixEventsV2
        .queryEvents()
        .eq("title", show.title)
        .ascending("dateAndTimeSettings.startDate");

      if (onlyUpcoming) {
        showsQuery = showsQuery.eq("status", "UPCOMING");
      }

      const [cast, crew, events] = await Promise.all([
        castQuery.find(),
        crewQuery.find(),
        showsQuery.find(),
      ]);

      return {
        ...show,
        cast: cast.items,
        crew: sortCreditsByPerson(crew.items as Credit[]),
        shows: events.items,
      };
    })
  );
  return showsWithData;
};
