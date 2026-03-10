import React from "react";
import type { Event } from "@wix/auto_sdk_events_wix-events-v-2";
import FormattedDateTime from "@/app/components/FormattedDateTime";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Link from "next/link";
import classnames from "classnames";

interface Props {
  data: Event[];
}

const ShowsList = ({ data }: Props) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  return (
    <div>
      <ol className="list">
        {data.map((event) => {
          const startDate = dayjs(event.dateAndTimeSettings?.startDate).tz(
            "America/New_York",
          );
          const showType = startDate.hour() < 17 ? "Matinee" : "Night";
          const ticketsSold = event.summaries?.tickets?.ticketsSold ?? 0;

          return (
            startDate && (
              <li key={event._id} className="list-row">
                <Link href={`/house/shows/${event.slug}`}>
                  <FormattedDateTime format="dddd" date={startDate.toDate()} />{" "}
                  {showType},{" "}
                  <FormattedDateTime
                    format="MMMM D h:mm a"
                    date={startDate.toDate()}
                  />
                  {` • ${ticketsSold} sold`}
                </Link>
              </li>
            )
          );
        })}
      </ol>
    </div>
  );
};

export default ShowsList;
