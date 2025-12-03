export interface Runeword {
  id: string;
  name: string;
  itemTypes: string[];
  runes: string[];
  sockets: number;
  minLevel: number;
  stats: string[];
  category: 'Helm' | 'Chest' | 'Shield' | 'Quiver' | 'Weapon';
}

export enum SortOption {
  LEVEL_ASC = 'Level (Low to High)',
  LEVEL_DESC = 'Level (High to Low)',
  NAME_ASC = 'Name (A-Z)',
  NAME_DESC = 'Name (Z-A)',
}

export interface FilterState {
  search: string;
  minLevel: number;
  maxLevel: number;
  sockets: number[];
  selectedTypes: string[];
  category: string;
}