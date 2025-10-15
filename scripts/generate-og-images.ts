import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getScaledToFitImageUrl } from "@/app/utils/wix/media";
import type { Show } from "@/app/types";
import wixClient from "@/lib/wixClient";
import { getImageWithDimensions } from "@/app/actions/media";
import chalk from "chalk";

const SIZE = { width: 1200, height: 630, margin: 20 };
const OUT_DIR = path.join(process.cwd(), "public", "og", "shows");

// simple fetch with timeout
async function fetchBuffer(url: string, ms = 8000): Promise<Buffer> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  } finally {
    clearTimeout(t);
  }
}

async function fetchShows() {
  const { items } = await wixClient.items.query("Shows").find();

  return items as Show[];
}

async function buildBackground(show: Show): Promise<Buffer> {
  // base canvas filled with backgroundColor (default #111)
  const base = sharp({
    create: {
      width: SIZE.width,
      height: SIZE.height,
      channels: 4,
      background: show.backgroundColor || "#111111",
    },
  }).png();

  // optional background texture: cover the canvas

  if (show.backgroundTexture) {
    const backgroundTexture = await getImageWithDimensions(
      show.backgroundTexture
    );
    try {
      const texBuf = await fetchBuffer(backgroundTexture.url);
      const tex = await sharp(texBuf)
        .resize(SIZE.width, SIZE.height, { fit: "cover" })
        .png()
        .toBuffer();

      return await base
        .composite([{ input: tex, left: 0, top: 0 }])
        .png()
        .toBuffer();
    } catch {
      // fall back to solid color if texture fetch fails
      return await base.png().toBuffer();
    }
  }

  return await base.png().toBuffer();
}

async function renderShow(show: Show): Promise<Buffer | null> {
  if (!show.logo) return null; // skip shows without a logo

  // 1) background (color/texture)
  const background = await buildBackground(show);

  // 2) main logo resized to fit inside the safe box
  const safeW = SIZE.width - SIZE.margin * 2;
  const safeH = SIZE.height - SIZE.margin * 2;

  let logoBuf: Buffer;
  try {
    const logoUrl = getScaledToFitImageUrl(show.logo, safeW, safeH, {});
    const raw = await fetchBuffer(logoUrl);
    // normalize to PNG and constrain to safe box (preserve aspect ratio)
    logoBuf = await sharp(raw)
      .resize(safeW, safeH, { fit: "inside" })
      .png()
      .toBuffer();
  } catch (e) {
    // if logo fetch/convert fails, skip this show
    return null;
  }

  // 3) create a transparent “safe area” canvas to center the logo,
  //    then place that into the background at the margin offset
  const overlay = await sharp({
    create: {
      width: safeW,
      height: safeH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: logoBuf, gravity: "center" }])
    .png()
    .toBuffer();

  const finalPng = await sharp(background)
    .composite([{ input: overlay, left: SIZE.margin, top: SIZE.margin }])
    .png()
    .toBuffer();

  return finalPng;
}

async function run() {
  console.log(
    `🖼️  Generating Open Graph images for shows to ${chalk.cyan(OUT_DIR)}`
  );
  await fs.mkdir(OUT_DIR, { recursive: true });
  const shows = await fetchShows();

  const tasks = shows.map(async (show) => {
    const slug = show.slug || show._id;
    try {
      const png = await renderShow(show);
      if (!png) {
        console.log(chalk.red(`(skip) ${slug} — no usable logo`));
        return;
      }
      const file = path.join(OUT_DIR, `${slug}.png`);
      await fs.writeFile(file, png);
      process.stdout.write(chalk.green("."));
    } catch (err) {
      console.warn(chalk.red(`OG FAIL for ${slug}:`, (err as Error).message));
    }
  });

  await Promise.all(tasks);
  console.log("✨Done!");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
