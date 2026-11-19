import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CatalogItem } from '../../models/catalog-item.model';

export interface CatalogDialogData {
  label: string;
  item?: CatalogItem;
  existingNames: string[];
}

// Name must be unique inside one catalog (case-insensitive).
function uniqueName(existing: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').trim().toLowerCase();
    return existing.some((n) => n.toLowerCase() === value) ? { notUnique: true } : null;
  };
}

@Component({
  selector: 'app-catalog-dialog',
  standalone: false,
  templateUrl: './catalog-dialog.component.html',
  styleUrl: './catalog-dialog.component.scss',
})
export class CatalogDialog {
  readonly data = inject<CatalogDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CatalogDialog>);
  private readonly fb = inject(FormBuilder);

  readonly isEdit = !!this.data.item;

  readonly form = this.fb.nonNullable.group({
    name: [
      this.data.item?.name ?? '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        uniqueName(this.data.existingNames.filter((n) => n !== this.data.item?.name)),
      ],
    ],
    description: [this.data.item?.description ?? '', [Validators.maxLength(200)]],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.dialogRef.close({
      ...this.data.item,
      name: value.name.trim(),
      description: value.description.trim() || undefined,
    });
  }
}
