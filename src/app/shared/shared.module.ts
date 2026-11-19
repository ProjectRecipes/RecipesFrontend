import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [ConfirmDialog],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [ConfirmDialog],
})
export class SharedModule {}
