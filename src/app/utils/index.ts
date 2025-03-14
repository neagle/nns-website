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
