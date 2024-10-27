"use client";

import { motion } from "framer-motion";
import { BasicCursor } from "./BasicCursor";
import { NameCursor } from "./NameCursor";
import type { CursorProps } from "@/app/editor/types";
import styles from "./Cursor.module.css";

export function Cursor({
  variant = "basic",
  x,
  y,
  color = ["", ""],
  name = "",
}: CursorProps) {
  return (
    <motion.div
      className={styles.cursor}
      initial={{ x, y }}
      animate={{ x, y }}
      transition={{
        type: "spring",
        bounce: 0.6,
        damping: 30,
        mass: 0.8,
        stiffness: 350,
        restSpeed: 0.01,
      }}
    >
      {variant === "basic" && <BasicCursor color={color} />}
      {variant === "name" && <NameCursor color={color} name={name} />}
    </motion.div>
  );
}
