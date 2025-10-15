import "dotenv/config";
import path from "node:path";
import type { Show } from "@/app/types";

import wixClient from "@/lib/wixClient";
// or: import { foo } from './local-util' // relative works too

// console.log("process.env", process.env);

async function getShows() {
  const { items } = await wixClient.items
    .query("Shows")
    .ascending("openingDate")
    .find();

  return items as Show[];
}

async function main() {
  console.log("Generating OG images...");
  const shows = await getShows();
  console.log("shows", shows);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
