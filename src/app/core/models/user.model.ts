export interface UserProfile {
  id: number;
  username: string;
  profileImage?: string;
  region?: string;
  bio?: string;
  recipeCount: number;
}

export interface UpdateProfileRequest {
  region: string | null;
  bio: string | null;
}
