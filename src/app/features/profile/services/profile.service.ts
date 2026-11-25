import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { UserProfile, UpdateProfileRequest } from '../../../core/models/user.model';

const MOCK_PROFILES: UserProfile[] = [
  {
    id: 1,
    username: 'marko',
    region: 'Vojvodina, Serbia',
    bio: 'bio1',
    recipeCount: 2,
  },
  {
    id: 2,
    username: 'jelena',
    region: 'Sumadija, Serbia',
    bio: 'bio2',
    recipeCount: 2,
  },
  {
    id: 3,
    username: 'ana',
    region: 'Macva, Serbia',
    recipeCount: 1,
  },
];

const MOCK_REGIONS: string[] = [
  'Vojvodina, Serbia',
  'Belgrade, Serbia',
  'Sumadija, Serbia',
  'Macva, Serbia',
  'Zlatibor, Serbia',
  'Eastern Serbia, Serbia',
  'Southern Serbia, Serbia',
  'Bosnia and Herzegovina',
  'Montenegro',
  'Dalmatia, Croatia',
  'Slavonia, Croatia',
  'North Macedonia',
  'Hungary',
  'Greece',
  'Italy',
];

const MOCK_CURRENT_USERNAME = 'marko';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  getCurrentUsername(): string | null {
    return MOCK_CURRENT_USERNAME;
  }

  getProfile(username: string): Observable<UserProfile> {
    const profile = MOCK_PROFILES.find((p) => p.username === username);
    if (!profile) {
      return throwError(() => new Error(`Profile with username "${username}" not found.`));
    }
    return of(profile).pipe(delay(300));
  }

  getRegions(): Observable<string[]> {
    return of(MOCK_REGIONS).pipe(delay(200));
  }

  updateMyProfile(request: UpdateProfileRequest): Observable<UserProfile> {
    const profile = this.findCurrentProfile();
    if (!profile) {
      return throwError(() => new Error('Not logged in.'));
    }
    profile.region = request.region ?? undefined;
    profile.bio = request.bio ?? undefined;
    return of({ ...profile }).pipe(delay(300));
  }

  uploadProfileImage(file: File): Observable<UserProfile> {
    const profile = this.findCurrentProfile();
    if (!profile) {
      return throwError(() => new Error('Not logged in.'));
    }
    profile.profileImage = URL.createObjectURL(file);
    return of({ ...profile }).pipe(delay(500));
  }

  private findCurrentProfile(): UserProfile | undefined {
    return MOCK_PROFILES.find((p) => p.username === MOCK_CURRENT_USERNAME);
  }
}
