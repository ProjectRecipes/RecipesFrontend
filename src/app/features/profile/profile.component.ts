import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, map, of, switchMap } from 'rxjs';

import { UserProfile } from '../../core/models/user.model';
import { ProfileService } from './services/profile.service';

const DEFAULT_AVATAR_URL = 'images/default-avatar.svg';

type ProfileState =
  | { status: 'loaded'; profile: UserProfile; isOwn: boolean }
  | { status: 'not-found'; username: string }
  | { status: 'logged-out' };


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: false,
})
export class Profile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly profileService = inject(ProfileService);

  readonly defaultAvatarUrl = DEFAULT_AVATAR_URL;
  state$!: Observable<ProfileState>;

  ngOnInit(): void {
    this.state$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const currentUsername = this.profileService.getCurrentUsername();
        const username = params.get('username') ?? currentUsername;
        if (!username) {
          return of<ProfileState>({ status: 'logged-out' });
        }
        return this.profileService.getProfile(username).pipe(
          map(
            (profile): ProfileState => ({
              status: 'loaded',
              profile,
              isOwn: profile.username === currentUsername,
            }),
          ),
          catchError(() => of<ProfileState>({ status: 'not-found', username })),
        );
      }),
    );
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith(this.defaultAvatarUrl)) {
      img.src = this.defaultAvatarUrl;
    }
  }
}