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
