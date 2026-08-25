export type ServiceLocale = "FR" | "EN";

const details = {
  FR: [
    ["Structure", "Contenu", "Mise en ligne"],
    ["Offre", "Visuel", "Page ou campagne"],
    ["Pages", "Promotions", "Messages"],
    ["Contexte", "Suivi", "Prochaine action"],
  ],
  EN: [
    ["Structure", "Content", "Go live"],
    ["Offer", "Visual", "Page or campaign"],
    ["Pages", "Promotions", "Messages"],
    ["Context", "Follow-up", "Next step"],
  ],
} as const;

export function getServiceDetails(locale: ServiceLocale, index: number) {
  return details[locale][index] ?? [];
}
