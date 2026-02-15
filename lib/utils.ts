import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const brandButtonClasses =
  "cursor-pointer text-base font-bold bg-background-light border-none rounded-none px-[2.25rem] py-3 transition-all duration-200 ease-in-out hover:bg-accent hover:text-background-light";
