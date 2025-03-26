import type { Show } from "@/app/types";
import wixClient from "@/lib/wixClient";

type Props = {
  shows: Show[];
  onlyUpcoming?: boolean;
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
        crew: crew.items,
        shows: events.items,
      };
    })
  );
  return showsWithData;
};
