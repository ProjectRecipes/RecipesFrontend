import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { LookupItem, RecipeSummary } from '../../../core/models/recipe.model';

/** A recipe the user can cook, with the ingredients they are missing. */
export interface CookableRecipe extends RecipeSummary {
  missingIngredients: string[];
}

/** A single rating of a recipe (1–5) and the date it was given. */
interface MockRating {
  value: number;
  date: string;
}

/** Mock recipe: card data plus the data needed for the calculations. */
interface MockRecipe extends Omit<RecipeSummary, 'averageRating' | 'ratingCount'> {
  /** Ingredient names used in the recipe. */
  ingredients: string[];
  ratings: MockRating[];
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

const MOCK_RECIPES: MockRecipe[] = [
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
    createdAt: daysAgo(20),
    ingredients: ['flour', 'milk', 'egg', 'salt'],
    ratings: [
      { value: 5, date: daysAgo(2) },
      { value: 5, date: daysAgo(10) },
      { value: 4, date: daysAgo(20) },
      { value: 3, date: daysAgo(60) },
    ],
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
    createdAt: daysAgo(3),
    ingredients: ['chicken', 'carrot', 'onion', 'salt'],
    ratings: [
      { value: 4, date: daysAgo(5) },
      { value: 5, date: daysAgo(15) },
      { value: 4, date: daysAgo(25) },
    ],
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
    createdAt: daysAgo(1),
    ingredients: ['bread', 'ham', 'cheese', 'butter'],
    ratings: [
      { value: 4, date: daysAgo(1) },
      { value: 4, date: daysAgo(3) },
    ],
  },
  {
    // Highly rated overall, but most ratings are older than a month,
    // so it is not at the top of the popular list.
    id: 4,
    title: 'Spaghetti Bolognese',
    author: { id: 1, username: 'marko' },
    mealType: lunch,
    dishType: pasta,
    dietTypes: [nonLenten],
    allergens: [gluten],
    servings: 4,
    prepTimeMinutes: 45,
    createdAt: daysAgo(50),
    ingredients: ['spaghetti', 'minced meat', 'tomato', 'onion'],
    ratings: [
      { value: 5, date: daysAgo(40) },
      { value: 5, date: daysAgo(45) },
      { value: 5, date: daysAgo(50) },
      { value: 3, date: daysAgo(10) },
    ],
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
    createdAt: daysAgo(0),
    ingredients: ['flour', 'egg', 'milk', 'cocoa', 'sugar'],
    ratings: [],
  },
];

/**
 * The logged-in user. Same mock user as in ProfileService.
 * Set to `null` to see the home page as a guest.
 * Will be replaced by AuthService once login (US-1.B) is done.
 */
const MOCK_CURRENT_USERNAME: string | null = 'marko';

/**
 * Ingredients each user has. Will be replaced by the user's
 * ingredient list (US-10) once it is done.
 */
const MOCK_USER_INGREDIENTS: Record<string, string[]> = {
  marko: ['egg', 'milk', 'flour', 'salt', 'bread', 'ham', 'cheese', 'butter'],
};

// ---------------------------------------------------------------------------

/** Popularity looks only at ratings from the last 30 days. */
const POPULAR_PERIOD_DAYS = 30;
/** A recipe is shown as cookable if at most this many ingredients are missing. */
const MAX_MISSING_INGREDIENTS = 2;

/** Average of the given ratings, or `undefined` if there are none. */
function average(ratings: MockRating[]): number | undefined {
  if (ratings.length === 0) {
    return undefined;
  }
  return ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;
}

/** Converts a mock recipe to the card data (overall rating from all ratings). */
function toSummary(recipe: MockRecipe): RecipeSummary {
  const { ratings } = recipe;
  return {
    id: recipe.id,
    title: recipe.title,
    author: recipe.author,
    mealType: recipe.mealType,
    dishType: recipe.dishType,
    dietTypes: recipe.dietTypes,
    allergens: recipe.allergens,
    servings: recipe.servings,
    prepTimeMinutes: recipe.prepTimeMinutes,
    mainImageUrl: recipe.mainImageUrl,
    createdAt: recipe.createdAt,
    averageRating: average(ratings),
    ratingCount: ratings.length,
  };
}

/**
 * Data source for the home page.
 * Returns mock data for now; once the backend is ready, the mock is replaced
 * with HTTP calls and the components stay the same.
 */
@Injectable({ providedIn: 'root' })
export class HomeService {
  /** Username of the logged-in user, or `null` for a guest. */
  getCurrentUsername(): string | null {
    return MOCK_CURRENT_USERNAME;
  }

  /**
   * Popular recipes: highest average rating in the last month.
   * Only ratings from the last 30 days are counted; recipes without
   * ratings in that period are not shown.
   */
  getPopularRecipes(): Observable<RecipeSummary[]> {
    const since = Date.now() - POPULAR_PERIOD_DAYS * 24 * 60 * 60 * 1000;

    const popular = MOCK_RECIPES.map((recipe) => {
      const recent = recipe.ratings.filter((r) => new Date(r.date).getTime() >= since);
      return { recipe, recentAverage: average(recent), recentCount: recent.length };
    })
      .filter((r) => r.recentAverage !== undefined)
      .sort(
        (a, b) => b.recentAverage! - a.recentAverage! || b.recentCount - a.recentCount,
      )
      .map((r) => toSummary(r.recipe));

    return of(popular).pipe(delay(300));
  }

  /** Newest recipes: sorted by publish date, newest first. */
  getNewestRecipes(): Observable<RecipeSummary[]> {
    const newest = [...MOCK_RECIPES]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(toSummary);
    return of(newest).pipe(delay(300));
  }

  /**
   * Recipes the logged-in user can cook from their ingredients.
   * Recipes with nothing missing come first, then those missing the fewest
   * (at most MAX_MISSING_INGREDIENTS). Empty for a guest.
   */
  getCookableRecipes(): Observable<CookableRecipe[]> {
    const username = this.getCurrentUsername();
    if (!username) {
      return of([]);
    }
    const owned = new Set(MOCK_USER_INGREDIENTS[username] ?? []);

    const cookable = MOCK_RECIPES.map((recipe) => ({
      ...toSummary(recipe),
      missingIngredients: recipe.ingredients.filter((name) => !owned.has(name)),
    }))
      .filter((r) => r.missingIngredients.length <= MAX_MISSING_INGREDIENTS)
      .sort((a, b) => a.missingIngredients.length - b.missingIngredients.length);

    return of(cookable).pipe(delay(300));
  }
}
