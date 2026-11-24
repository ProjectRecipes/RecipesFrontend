import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RecipeSummary } from '../../core/models/recipe.model';
import { CookableRecipe, HomeService } from './services/home.service';

/** Recipe views on the home page. */
export type HomeView = 'popular' | 'newest' | 'cookable';

/** A link to another feature of the app. */
interface NavLink {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false,
})
export class Home implements OnInit {
  private readonly homeService = inject(HomeService);

  /** Popular recipes are the default view (per the spec). */
  view: HomeView = 'popular';
  recipes$!: Observable<RecipeSummary[] | CookableRecipe[]>;

  readonly navLinks: NavLink[] = [
    { label: 'Search recipes', icon: 'search', route: '/search' },
    { label: 'My ingredients', icon: 'kitchen', route: '/ingredients' },
    { label: 'Shopping lists', icon: 'shopping_cart', route: '/shopping-lists' },
    { label: 'Recipe map', icon: 'public', route: '/map' },
    { label: 'Profile', icon: 'person', route: '/profile' },
  ];

  ngOnInit(): void {
    this.loadRecipes();
  }

  onViewChange(view: HomeView): void {
    this.view = view;
    this.loadRecipes();
  }

  /** Number of missing ingredients (only in the "What I can cook" view). */
  missingCount(recipe: RecipeSummary | CookableRecipe): number | null {
    return 'missingIngredientsCount' in recipe ? recipe.missingIngredientsCount : null;
  }

  private loadRecipes(): void {
    switch (this.view) {
      case 'popular':
        this.recipes$ = this.homeService.getPopularRecipes();
        break;
      case 'newest':
        this.recipes$ = this.homeService.getNewestRecipes();
        break;
      case 'cookable':
        this.recipes$ = this.homeService.getCookableRecipes();
        break;
    }
  }
}
