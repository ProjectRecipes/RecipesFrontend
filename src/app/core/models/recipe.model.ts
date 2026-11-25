/**
 * An item from a list managed by the administrator in the database
 * (meal type, dish type, diet type, allergen...).
 */
export interface LookupItem {
  id: number;
  name: string;
}

/** Basic author info shown with a recipe. */
export interface RecipeAuthor {
  id: number;
  username: string;
}

/**
 * Basic recipe info shown on the recipe card
 * (home page, search, profile).
 * Field names match the backend `Recipe` entity.
 */
export interface RecipeSummary {
  id: number;
  title: string;
  author: RecipeAuthor;
  mealType: LookupItem;
  dishType: LookupItem;
  dietTypes: LookupItem[];
  /** Calculated by the backend from the recipe's ingredients. */
  allergens: LookupItem[];
  servings: number;
  /** Total preparation time in minutes. */
  prepTimeMinutes: number;
  /** URL of the main image (backend `mainImage`). */
  mainImageUrl?: string;
  /** Average rating 1–5; missing if the recipe has no ratings yet. */
  averageRating?: number;
  ratingCount: number;
  /** Publish date (ISO string). */
  createdAt: string;
}
