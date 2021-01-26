export enum Zone {
  toate = 'toate',
  botanica = 'botanica',
  buiucani = 'buiucani',
  centru = 'centru',
  ciocana = 'ciocana',
  riscani = 'riscani',
  telecentru = 'telecentru',
  suburbii = 'suburbii',
}

export const zones = Object.values(Zone);

/**
 * TODO: refactor to use normal l10n
 *
 * @deprecated use {@link Zone} instead
 */
export const KIV_ZONES = [
  {
    label: 'Centru',
    value: Zone.centru,
  },
  {
    label: 'Telecentru',
    value: Zone.telecentru,
  },
  {
    label: 'Botanica',
    value: Zone.botanica,
  },
  {
    label: 'Buiucani',
    value: Zone.buiucani,
  },
  {
    label: 'Ciocana',
    value: Zone.ciocana,
  },
  {
    label: 'Rîșcani',
    value: Zone.riscani,
  },
  {
    label: 'Suburbii',
    value: Zone.suburbii,
  },
];

// TODO: Move in volunteers/shared
export enum VolunteerRole {
  delivery = 'delivery',
  copilot = 'copilot',
  packing = 'packing',
  supply = 'supply',
  operator = 'operator',
}

// TODO: Move in volunteers/shared
export const volunteerRoles = Object.values(VolunteerRole);

export enum SpecialCondition {
  disability = 'disability',
  deaf_mute = 'deaf_mute',
  blind_weak_seer = 'blind_weak_seer',
}

export const specialConditions = Object.values(SpecialCondition);
