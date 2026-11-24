import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { RecipeCard } from './components/recipe-card/recipe-card.component';

/** Shared components used by all feature modules. */
@NgModule({
  declarations: [RecipeCard],
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule],
  exports: [RecipeCard],
})
export class SharedModule {}
