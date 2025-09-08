import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind class names conditionally.
 * Example: cn("base", isActive && "active")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
