"use client";

import React from "react";
import type { V3Event } from "@wix/auto_sdk_events_wix-events-v-2";
import dayjs from "dayjs";
import classnames from "classnames";
import Link from "next/link";

type Props = {
  event: V3Event;
  className?: string;
};

const ShowTime = ({ event, className = "" }: Props) => {
  if (!event.dateAndTimeSettings) {
    return;
  }

  const startDate = dayjs(event.dateAndTimeSettings.startDate);
  // Set showType based on whether the startDate is before or after 5 PM
  const showType = startDate.hour() < 17 ? "Matinee" : "Night";

  const EventComponent = () => (
    <div
      className={classnames(
        className,
        {
          "bg-info/25": event.status !== "CANCELED",
          "hover:bg-info/40": event.status !== "CANCELED",
          "bg-error/25": event.status === "CANCELED",
          "hover:bg-error/25": event.status === "CANCELED",
        },
        ["rounded-lg", "transition-all", "py-2", "px-3"]
      )}
    >
      <div
        className={classnames(className, [
          "flex",
          "justify-between",
          "grow-0",
          "items-center",
        ])}
      >
        <div className={classnames(["flex", "flex-col", "mr-3"])}>
          <div
            className={classnames(
              {
                "text-info": event.status !== "CANCELED",
                "text-error": event.status === "CANCELED",
                "opacity-50": event.status === "CANCELED",
              },
              ["text-[1.875em]", "leading-[1.2em]", "text-center", "font-bold"]
            )}
          >
            {startDate.format("D")}
          </div>
          <div
            className={classnames(
              {
                "text-info": event.status !== "CANCELED",
                "text-error": event.status === "CANCELED",
                "opacity-50": event.status === "CANCELED",
              },
              [
                "text-[0.75em]",
                "leading-[0.75em]",
                "whitespace-nowrap",
                "font-bold",
              ]
            )}
          >
            {startDate.format("MMM YYYY")}
          </div>
        </div>
        <div className="grow-1">
          <div
            className={classnames({}, [
              "font-bold",
              "leading-[1em]",
              "mb-1",
              "text-primary",
            ])}
          >
            <span
              className={classnames({
                "opacity-50": event.status === "CANCELED",
              })}
            >
              {startDate.format("dddd")} {showType}
            </span>
            {event.status === "CANCELED" && (
              <span className="text-error"> - CANCELED</span>
            )}
          </div>
          <div
            className={classnames(
              {
                "opacity-50": event.status === "CANCELED",
              },
              ["leading-[1em]"]
            )}
          >
            {startDate.format("h:mm")} <span>{startDate.format("A")}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return event.status === "CANCELED" ? (
    <div key={event._id} className="canceled">
      <EventComponent />
    </div>
  ) : (
    <Link
      key={event._id}
      href={event.eventPageUrl || ""}
      className={classnames([
        "block",
        // "group-hover:scale-95",
        "transition-all",
        // "duration-500",
        "hover:scale-105",
        "focus:scale-105",
        "rounded-lg",
      ])}
    >
      <EventComponent />
    </Link>
  );
};

export default ShowTime;
