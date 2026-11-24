import { Component, Input } from '@angular/core';

import { RecipeSummary } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
  standalone: false,
})
export class RecipeCard {
  @Input({ required: true }) recipe!: RecipeSummary;

  /** All diet types joined into one line, e.g. "vegetarian, lenten". */
  dietNames(): string {
    return this.recipe.dietTypes.map((d) => d.name).join(', ');
  }

  formatTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) {
      return `${m} min`;
    }
    return m === 0 ? `${h} h` : `${h} h ${m} min`;
  }
}
