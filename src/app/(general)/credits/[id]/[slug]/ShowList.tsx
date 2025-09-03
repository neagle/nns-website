"use client";
import React from "react";
import type { Credit } from "@/app/types";
import ShowPanel from "./ShowPanel";
import { motion } from "motion/react";
import classnames from "classnames";

interface Props {
  credits: [string, Credit[]][];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ShowList = ({ credits }: Props) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className={classnames(["grid", "xl:grid-cols-2", "gap-8"])}
  >
    {credits.map(([showId, credits]) => (
      <motion.div key={showId} variants={childVariants}>
        <ShowPanel credits={credits} />
      </motion.div>
    ))}
  </motion.div>
);

export default ShowList;
