import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges conditional class names and resolves conflicting Tailwind utility
// classes (e.g. "p-2 p-4" -> "p-4"). Every component that accepts a
// `className` prop should route it through this instead of string-
// concatenating classes ad hoc.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
