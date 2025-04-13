"use client";

import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

interface Props {
  date: Date;
  format: string;
  className?: string;
  timeZone?: string;
}

const DateTime = ({
  date,
  format,
  className = "",
  timeZone = "America/New_York",
}: Props) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const d = dayjs(date).tz(timeZone);
  return <span className={className}>{d.format(format)}</span>;
};

export default DateTime;
