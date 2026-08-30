/**
 * SVG Line-Art Icons for UniGuard NOC Dashboard
 * Clean outlines, stroke-only, inheriting color via currentColor.
 */

/**
 * Protected Network — Server Rack icon
 * Stacked horizontal bars with indicator dots
 */
export function iconServer(size = 48) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="10" y="6" width="28" height="36" rx="2" />
    <rect x="14" y="10" width="20" height="7" rx="1" />
    <circle cx="30" cy="13.5" r="1.5" fill="currentColor" stroke="none" />
    <line x1="17" y1="13.5" x2="25" y2="13.5" />
    <rect x="14" y="20" width="20" height="7" rx="1" />
    <circle cx="30" cy="23.5" r="1.5" fill="currentColor" stroke="none" />
    <line x1="17" y1="23.5" x2="25" y2="23.5" />
    <rect x="14" y="30" width="20" height="7" rx="1" />
    <circle cx="30" cy="33.5" r="1.5" fill="currentColor" stroke="none" />
    <line x1="17" y1="33.5" x2="25" y2="33.5" />
  </svg>`;
}

/**
 * One-Way Gate — Data Diode symbol
 * Triangle/arrow pointing right with a blocking bar on the left.
 * Unambiguous unidirectional flow — the key visual metaphor.
 */
export function iconDiode(size = 48) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="10" x2="12" y2="38" stroke-width="2.5" />
    <polygon points="16,10 34,24 16,38" fill="none" />
    <line x1="34" y1="10" x2="34" y2="38" stroke-width="2" />
    <line x1="34" y1="24" x2="42" y2="24" />
    <polyline points="39,20 42,24 39,28" />
    <line x1="6" y1="24" x2="12" y2="24" />
  </svg>`;
}

/**
 * AI Sentinel — Radar / Scanning icon
 * Concentric arc segments radiating from center, like a radar sweep.
 */
export function iconRadar(size = 48) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="24" cy="24" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="24" cy="24" r="7" />
    <path d="M 24 11 A 13 13 0 0 1 37 24" />
    <path d="M 24 37 A 13 13 0 0 1 11 24" />
    <path d="M 24 6 A 18 18 0 0 1 42 24" />
    <path d="M 24 42 A 18 18 0 0 1 6 24" />
    <line x1="24" y1="24" x2="24" y2="6" stroke-width="1" opacity="0.6" />
    <circle cx="30" cy="14" r="1.5" fill="currentColor" stroke="none" opacity="0.7" />
    <circle cx="35" cy="21" r="1" fill="currentColor" stroke="none" opacity="0.5" />
  </svg>`;
}

/**
 * Workstation / Terminal Icon
 */
export function iconTerminal(size = 48) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="8" y="10" width="32" height="22" rx="2" />
    <polyline points="14,17 19,21 14,25" />
    <line x1="22" y1="25" x2="28" y2="25" />
    <line x1="18" y1="32" x2="30" y2="32" />
    <line x1="24" y1="32" x2="24" y2="38" />
    <line x1="16" y1="38" x2="32" y2="38" />
  </svg>`;
}

/**
 * Cloud Gateway Icon
 */
export function iconCloud(size = 48) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 12 30 A 8 8 0 0 1 12 14 A 12 12 0 0 1 34 16 A 9 9 0 0 1 36 30 Z" />
    <line x1="24" y1="30" x2="24" y2="38" stroke-dasharray="2 2" />
    <polyline points="20,35 24,39 28,35" />
  </svg>`;
}

/**
 * IoT Sensor / Hardware Chip Icon
 */
export function iconChip(size = 48) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="14" y="14" width="20" height="20" rx="2" />
    <rect x="20" y="20" width="8" height="8" />
    <!-- Pin connectors -->
    <line x1="18" y1="8" x2="18" y2="14" />
    <line x1="24" y1="8" x2="24" y2="14" />
    <line x1="30" y1="8" x2="30" y2="14" />
    <line x1="18" y1="34" x2="18" y2="40" />
    <line x1="24" y1="34" x2="24" y2="40" />
    <line x1="30" y1="34" x2="30" y2="40" />
    <line x1="8" y1="18" x2="14" y2="18" />
    <line x1="8" y1="24" x2="14" y2="24" />
    <line x1="8" y1="30" x2="14" y2="30" />
    <line x1="34" y1="18" x2="40" y2="18" />
    <line x1="34" y1="24" x2="40" y2="24" />
    <line x1="34" y1="30" x2="40" y2="30" />
  </svg>`;
}

/**
 * Database Vault / Encrypted Storage Icon
 */
export function iconDatabase(size = 48) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="24" cy="12" rx="14" ry="5" />
    <path d="M 10 12 v 10 c 0 2.76 6.27 5 14 5 s 14 -2.24 14 -5 V 12" />
    <path d="M 10 22 v 10 c 0 2.76 6.27 5 14 5 s 14 -2.24 14 -5 V 22" />
    <path d="M 10 32 v 4 c 0 2.76 6.27 5 14 5 s 14 -2.24 14 -5 V 32" />
  </svg>`;
}

/**
 * Header Logo — Hexagonal shield
 */
export function iconLogo(size = 28) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" stroke="var(--color-safe, #00D9A3)" />
    <polygon points="16,8 22,11.5 22,18.5 16,22 10,18.5 10,11.5" stroke="var(--color-accent, #4A9EFF)" stroke-width="1" />
    <line x1="12" y1="15" x2="20" y2="15" stroke="var(--color-safe, #00D9A3)" stroke-width="1" />
    <polyline points="18,12.5 20,15 18,17.5" stroke="var(--color-safe, #00D9A3)" stroke-width="1" />
  </svg>`;
}
