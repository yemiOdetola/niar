import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isTypeText(type: string | undefined) {
  return type == "text" || type == "i-text" || type == "textbox";
}
