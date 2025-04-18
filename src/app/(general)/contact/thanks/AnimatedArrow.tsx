"use client";

import React from "react";
import { motion } from "motion/react";
import { Minus, ArrowRight } from "lucide-react";
import classnames from "classnames";

interface Props {
  className?: string;
  size?: number;
  duration?: number;
}

const AnimatedArrow = ({ className = "", size = 36, duration = 2 }: Props) => {
  return (
    <div
      className={classnames(
        ["inline-flex", "gap-2", "select-none", "items-center"],
        className
      )}
    >
      {[
        <ArrowRight key="0" size={size * 0.7} color="var(--color-secondary)" />,
        <ArrowRight key="1" size={size} color="var(--color-info)" />,
        <ArrowRight key="2" size={size * 1.3} color="var(--color-accent)" />,
      ].map((Symbol, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [-15, -5, 5, 15],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            delay: index * (duration / 6),
          }}
        >
          {Symbol}
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedArrow;
