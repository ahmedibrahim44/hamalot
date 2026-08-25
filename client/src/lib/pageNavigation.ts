export type NavigationPage = "home" | "process" | "ecosystem" | "pricing" | "services" | "access" | "privacy" | "terms";

export function isCurrentPage(current: NavigationPage, target: NavigationPage) {
  return current === target;
}
