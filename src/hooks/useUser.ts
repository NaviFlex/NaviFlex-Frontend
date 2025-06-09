// src/hooks/useUser.ts
import { getDecodedAccessToken } from '@/utils/auth';

export function useUser() {
  const payload = getDecodedAccessToken();
  if (!payload) return null;

  return {
    userId: payload.user_id,
    email: payload.sub,
    profileId: payload.profile_id,
  };
}
