import type { Show } from "@/app/types";
import wixClient from "@/lib/wixClient";

export const getShowsWithData = async ({ shows }: { shows: Show[] }) => {
  "use server";

  const showsWithData = await Promise.all(
    shows.map(async (show: Show) => {
      const [cast, crew, events] = await Promise.all([
        wixClient.items
          .query("Credits")
          .eq("show", show._id)
          .eq("category", "cast")
          .include("person")
          .ascending("order")
          .find(),
        wixClient.items
          .query("Credits")
          .eq("show", show._id)
          .eq("category", "crew")
          .include("person")
          .ascending("order")
          .find(),
        wixClient.wixEventsV2
          .queryEvents()
          .eq("title", show.title)
          .ascending("dateAndTimeSettings.startDate")
          .find(),
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
