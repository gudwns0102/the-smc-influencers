export function filterNull<T>(item: T | null): item is T {
  return item !== null;
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const randomDelay = (min: number, max: number) =>
  sleep(Math.floor(Math.random() * (max - min + 1) + min));
