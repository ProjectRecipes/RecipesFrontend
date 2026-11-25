import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { RecipeCard } from './components/recipe-card/recipe-card.component';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog.component';

/** Shared components used by all feature modules. */
@NgModule({
  declarations: [RecipeCard, ConfirmDialog],
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatDialogModule, MatButtonModule],
  exports: [RecipeCard, ConfirmDialog],
})
export class SharedModule {}
