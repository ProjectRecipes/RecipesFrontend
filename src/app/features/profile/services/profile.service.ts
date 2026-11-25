import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { UserProfile } from '../../../core/models/user.model';


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

const MOCK_CURRENT_USERNAME = 'marko';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    getCurrentUsername(): string | null {
        return MOCK_CURRENT_USERNAME;
    }

    getProfile(username: string): Observable<UserProfile> {
        const profile = MOCK_PROFILES.find(p => p.username === username);
        if (!profile) {
            return throwError(() => new Error(`Profile with username "${username}" not found.`));
        }
        return of(profile).pipe(delay(300));
    }
}