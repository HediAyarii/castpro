// Configuration des codes d'accès pour les différents portfolios
export const ACCESS_CODES = {
  // Portfolio secret - Collection ultra-exclusive
  SECRET_PORTFOLIO: "ck_zozswr9avalmps6pvo5s0s",
  
  // Portfolio acteurs - Collection standard (ancien code)
  ACTORS_PORTFOLIO: "CASTPRO2024"
} as const

// Types pour les différents niveaux d'accès
export type AccessLevel = "secret" | "actors" | "none"

// Fonction pour vérifier le niveau d'accès
export function checkAccessLevel(code: string): AccessLevel {
  if (code === ACCESS_CODES.SECRET_PORTFOLIO) {
    return "secret"
  }
  if (code === ACCESS_CODES.ACTORS_PORTFOLIO) {
    return "actors"
  }
  return "none"
}

// Fonction pour obtenir la route de redirection selon le niveau d'accès
export function getRedirectRoute(accessLevel: AccessLevel): string {
  switch (accessLevel) {
    case "secret":
      return "/portfolio-secret"
    case "actors":
      return "/portfolio-acteurs"
    default:
      return "/"
  }
}
