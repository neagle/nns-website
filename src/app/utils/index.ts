import type { Person } from "@/app/types";

export const fullName = ({
  firstName = "",
  middleName = "",
  lastName = "",
}) => {
  return [firstName, middleName, lastName].join(" ");
};

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function getWixImageDimensions(wixUrl: string) {
  const match = /originWidth=(?<width>\d+)&originHeight=(?<height>\d+)/g.exec(
    wixUrl
  )?.groups;
  if (!match) {
    throw new Error(`Could not parse Wix image dimensions: ${wixUrl}`);
  }

  const { width, height } = match;

  return { width: parseInt(width, 10), height: parseInt(height, 10) };
}

export const nameSlug = ({ firstName, middleName, lastName }: Person) => {
  const slug = [firstName, middleName, lastName]
    .filter((name) => !!name)
    .map((name) => encodeURIComponent(String(name).replaceAll(" ", "_")))
    .join("-");

  return slug;
};

// Wix has a pretty interesting feature: its items come with a `_manualSort` key
// that seems to reflect the order in which items are arranged in tables in the
// CMS. That's kinda handy: it means the person entering the data can control
// the order of items without having to have an extra "order" column that's hard
// to maintain.

// However -- it's weird that it's called _manualSort-asdfasdfasdfasdf -- some
// weird ID. Where does that even come from? Is this an experimental feature?
// Who knows. We will take advantage of it for the time being.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const manualSort = (arr: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return arr.toSorted((a: any, b: any) => {
    const sortKeyName = /^_manualSort/;
    const sortKey = Object.keys(a).find((key) => sortKeyName.test(key));
    const aSortValue = (a[sortKey as keyof typeof a] as string) || "";
    const bSortValue = (b[sortKey as keyof typeof b] as string) || "";
    return aSortValue.localeCompare(bSortValue);
  });
};

// Simple delay function to simulate async operations
// Used only for development and testing
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Convert a srcSet string to a CSS image-set() value
// @see https://nextjs.org/docs/pages/api-reference/components/image#background-css
export const getBackgroundImage = (srcSet = "") => {
  const imageSet = srcSet
    .split(", ")
    .map((str) => {
      const [url, dpi] = str.split(" ");
      return `url("${url}") ${dpi}`;
    })
    .join(", ");
  return `image-set(${imageSet})`;
};
