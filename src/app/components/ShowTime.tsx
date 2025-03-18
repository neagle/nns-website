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

  return (
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
      <div
        className={classnames(className, [
          "bg-info/25",
          "hover:bg-info/40",
          "rounded-lg",
          "transition-all",
          "py-2",
          "px-3",
        ])}
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
              className={classnames([
                "text-[1.875em]",
                "leading-[1.2em]",
                "text-center",
                "font-bold",
                "text-info",
              ])}
            >
              {startDate.format("D")}
            </div>
            <div
              className={classnames([
                // Was: text-xs => 0.75rem => text-[0.75em]
                "text-[0.75em]",
                // Was: leading-3 => 0.75rem => leading-[0.75em]
                "leading-[0.75em]",
                "text-info/70",
                "whitespace-nowrap",
              ])}
            >
              {startDate.format("MMM YYYY")}
            </div>
          </div>
          <div className="grow-1">
            <div
              className={classnames([
                "font-bold",
                // Was: leading-4 => 1rem => leading-[1em]
                "leading-[1em]",
                "mb-1",
                "text-primary/50",
              ])}
            >
              {startDate.format("dddd")} {showType}
            </div>
            <div
              className={classnames([
                // Same logic: leading-4 => 1rem => leading-[1em]
                "leading-[1em]",
              ])}
            >
              {startDate.format("h:mm")} <span>{startDate.format("A")}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShowTime;
