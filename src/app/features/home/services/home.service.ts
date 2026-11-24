import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { LookupItem, RecipeSummary } from '../../../core/models/recipe.model';

/** A recipe the user can cook, with the number of missing ingredients. */
export interface CookableRecipe extends RecipeSummary {
  missingIngredientsCount: number;
}

// --- Temporary mock data until the backend endpoints are ready --------------
// Lookup names and ids match the backend seed data (data.sql).

const breakfast: LookupItem = { id: 1, name: 'breakfast' };
const lunch: LookupItem = { id: 2, name: 'lunch' };
const dessert: LookupItem = { id: 7, name: 'dessert' };

const soup: LookupItem = { id: 1, name: 'soup' };
const pasta: LookupItem = { id: 3, name: 'pasta' };
const sandwich: LookupItem = { id: 5, name: 'sandwich' };
const cake: LookupItem = { id: 12, name: 'cake' };
const pancakes: LookupItem = { id: 14, name: 'pancakes' };

const vegetarian: LookupItem = { id: 1, name: 'vegetarian' };
const nonLenten: LookupItem = { id: 4, name: 'non-lenten' };

const milk: LookupItem = { id: 2, name: 'milk' };
const gluten: LookupItem = { id: 1, name: 'gluten' };
const eggs: LookupItem = { id: 3, name: 'eggs' };

/** Helper: the date `days` days ago as an ISO string. */
function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

const MOCK_RECIPES: RecipeSummary[] = [
  {
    id: 1,
    title: 'Pancakes',
    author: { id: 1, username: 'marko' },
    mealType: breakfast,
    dishType: pancakes,
    dietTypes: [vegetarian],
    allergens: [milk, gluten, eggs],
    servings: 4,
    prepTimeMinutes: 30,
    averageRating: 4.7,
    ratingCount: 12,
    createdAt: daysAgo(20),
  },
  {
    id: 2,
    title: 'Chicken soup',
    author: { id: 2, username: 'jelena' },
    mealType: lunch,
    dishType: soup,
    dietTypes: [nonLenten],
    allergens: [],
    servings: 6,
    prepTimeMinutes: 90,
    averageRating: 4.5,
    ratingCount: 8,
    createdAt: daysAgo(3),
  },
  {
    id: 3,
    title: 'Ham and cheese sandwich',
    author: { id: 3, username: 'ana' },
    mealType: breakfast,
    dishType: sandwich,
    dietTypes: [nonLenten],
    allergens: [gluten, milk],
    servings: 2,
    prepTimeMinutes: 10,
    averageRating: 4.2,
    ratingCount: 5,
    createdAt: daysAgo(1),
  },
  {
    id: 4,
    title: 'Spaghetti Bolognese',
    author: { id: 1, username: 'marko' },
    mealType: lunch,
    dishType: pasta,
    dietTypes: [nonLenten],
    allergens: [gluten],
    servings: 4,
    prepTimeMinutes: 45,
    averageRating: 3.9,
    ratingCount: 15,
    createdAt: daysAgo(10),
  },
  {
    id: 5,
    title: 'Chocolate cake',
    author: { id: 2, username: 'jelena' },
    mealType: dessert,
    dishType: cake,
    dietTypes: [vegetarian],
    allergens: [milk, gluten, eggs],
    servings: 8,
    prepTimeMinutes: 75,
    ratingCount: 0,
    createdAt: daysAgo(0),
  },
];

// ---------------------------------------------------------------------------

/**
 * Data source for the home page.
 * Returns mock data for now; once the backend is ready, the mock is replaced
 * with HTTP calls and the components stay the same.
 */
@Injectable({ providedIn: 'root' })
export class HomeService {
  /**
   * Popular recipes: highest average rating in the past month.
   * (The backend will average only ratings from the last 30 days.)
   */
  getPopularRecipes(): Observable<RecipeSummary[]> {
    const popular = MOCK_RECIPES.filter((r) => r.averageRating !== undefined).sort(
      (a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0),
    );
    return of(popular).pipe(delay(300));
  }

  /** Newest recipes: sorted by publish date, newest first. */
  getNewestRecipes(): Observable<RecipeSummary[]> {
    const newest = [...MOCK_RECIPES].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return of(newest).pipe(delay(300));
  }

  /**
   * Recipes the user can cook from their available ingredients.
   * Ones with nothing missing first, then those missing the fewest.
   */
  getCookableRecipes(): Observable<CookableRecipe[]> {
    const cookable: CookableRecipe[] = [
      { ...MOCK_RECIPES[2], missingIngredientsCount: 0 },
      { ...MOCK_RECIPES[0], missingIngredientsCount: 0 },
      { ...MOCK_RECIPES[3], missingIngredientsCount: 2 },
    ];
    return of(cookable).pipe(delay(300));
  }
}
