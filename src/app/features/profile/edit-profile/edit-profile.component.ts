import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, forkJoin, map, of, startWith, switchMap } from 'rxjs';

import { UserProfile } from '../../../core/models/user.model';
import { ProfileService } from '../services/profile.service';

const DEFAULT_AVATAR_URL = 'images/default-avatar.svg';
const MAX_IMAGE_SIZE_MB = 5;
const BIO_MAX_LENGTH = 500;

function allowedValueValidator(allowed: () => string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null;
    if (!value) {
      return null;
    }
    return allowed().includes(value) ? null : { notInList: true };
  };
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  standalone: false,
})
export class EditProfile implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly profileService = inject(ProfileService);

  readonly defaultAvatarUrl = DEFAULT_AVATAR_URL;
  readonly maxImageSizeMb = MAX_IMAGE_SIZE_MB;
  readonly bioMaxLength = BIO_MAX_LENGTH;

  profile: UserProfile | null = null;
  regions: string[] = [];
  filteredRegions$!: Observable<string[]>;

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  imageError: string | null = null;
  saving = false;

  readonly form = this.fb.group({
    username: [{ value: '', disabled: true }],
    region: ['', allowedValueValidator(() => this.regions)],
    bio: ['', Validators.maxLength(BIO_MAX_LENGTH)],
  });

  ngOnInit(): void {
    const username = this.profileService.getCurrentUsername();
    if (!username) {
      this.router.navigate(['/profile']);
      return;
    }

    forkJoin([
      this.profileService.getProfile(username),
      this.profileService.getRegions(),
    ]).subscribe({
      next: ([profile, regions]) => {
        this.profile = profile;
        this.regions = regions;
        this.form.patchValue({
          username: profile.username,
          region: profile.region ?? '',
          bio: profile.bio ?? '',
        });
      },
      error: () => this.router.navigate(['/profile']),
    });

    this.filteredRegions$ = this.form.controls.region.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterRegions(value ?? '')),
    );
  }

  ngOnDestroy(): void {
    this.revokePreview();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.imageError = 'Please choose an image file.';
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      this.imageError = `The image must be smaller than ${MAX_IMAGE_SIZE_MB} MB.`;
      return;
    }

    this.imageError = null;
    this.revokePreview();
    this.selectedFile = file;
    this.previewUrl = URL.createObjectURL(file);
    this.form.markAsDirty();
  }

  clearSelectedImage(): void {
    this.revokePreview();
    this.selectedFile = null;
  }

  save(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;

    const { region, bio } = this.form.getRawValue();
    const upload$: Observable<UserProfile | null> = this.selectedFile
      ? this.profileService.uploadProfileImage(this.selectedFile)
      : of(null);

    upload$
      .pipe(
        switchMap(() =>
          this.profileService.updateMyProfile({
            region: region || null,
            bio: bio?.trim() || null,
          }),
        ),
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Profile updated', 'OK', { duration: 3000 });
          this.router.navigate(['/profile']);
        },
        error: () => {
          this.saving = false;
          this.snackBar.open('Saving failed. Please try again.', 'OK', { duration: 5000 });
        },
      });
  }

  private filterRegions(value: string): string[] {
    const query = value.trim().toLowerCase();
    return this.regions.filter((r) => r.toLowerCase().includes(query));
  }

  private revokePreview(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }
}
