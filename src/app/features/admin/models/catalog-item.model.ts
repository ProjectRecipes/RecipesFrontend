export interface CatalogItem {
  id: number;
  name: string;
  description?: string;
}

export type CatalogType =
  | 'meal-types'
  | 'dish-types'
  | 'diet-types'
  | 'ingredient-categories'
  | 'allergens';

export interface CatalogDefinition {
  type: CatalogType;
  label: string;
}

export const CATALOGS: CatalogDefinition[] = [
  { type: 'meal-types', label: 'Meal types' },
  { type: 'dish-types', label: 'Dish types' },
  { type: 'diet-types', label: 'Diet types' },
  { type: 'ingredient-categories', label: 'Ingredient categories' },
  { type: 'allergens', label: 'Allergens' },
];
