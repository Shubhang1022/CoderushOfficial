import { AdminUser } from '../types';
import { StorageService } from './storageService';
import { signJWT, verifyJWT } from '../utils/jwt';

const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-super-1',
  username: 'CoderushOfficials',
  email: 'admin.coderush@bbdniit.ac.in',
  full_name: 'CodeRush Super Admin',
  role: 'super_admin',
  profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
};

const DEFAULT_PASSWORD = 'offiicialcoderush2026';

export interface AuthSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

export class AuthService {
  static async login(
    usernameInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; user?: AdminUser; token?: string; error?: string }> {
    const cleanUsername = usernameInput.trim();

    if (cleanUsername.toLowerCase() === DEFAULT_ADMIN.username.toLowerCase() && passwordInput === DEFAULT_PASSWORD) {
      const nowSec = Math.floor(Date.now() / 1000);
      const expSec = nowSec + 86400 * 7; // 7 days expiration

      // Generate cryptographically signed HMAC-SHA256 JWT Token
      const jwtToken = await signJWT({
        sub: DEFAULT_ADMIN.id,
        username: DEFAULT_ADMIN.username,
        role: DEFAULT_ADMIN.role,
        iat: nowSec,
        exp: expSec,
      });

      const session: AuthSession = {
        user: DEFAULT_ADMIN,
        token: jwtToken,
        expiresAt: expSec * 1000,
      };

      StorageService.saveAuthSession(session);
      StorageService.addLog('Admin Login', `Admin ${DEFAULT_ADMIN.username} authenticated successfully with signed JWT token`);
      return { success: true, user: DEFAULT_ADMIN, token: jwtToken };
    }

    StorageService.addLog('Failed Login', `Failed login attempt for username "${usernameInput}"`);
    return { success: false, error: 'Invalid admin username or password' };
  }

  /**
   * Cryptographically verifies the active session token.
   */
  static async verifySession(): Promise<boolean> {
    const session = StorageService.getAuthSession() as AuthSession | null;
    if (!session || !session.token) return false;

    const payload = await verifyJWT(session.token);
    if (!payload) {
      StorageService.clearAuthSession();
      return false;
    }
    return true;
  }

  static getCurrentUser(): AdminUser | null {
    const session = StorageService.getAuthSession() as AuthSession | null;
    if (!session || !session.user || !session.token || session.expiresAt < Date.now()) {
      return null;
    }
    return session.user;
  }

  static isAuthenticated(): boolean {
    return Boolean(this.getCurrentUser());
  }

  static logout(): void {
    const user = this.getCurrentUser();
    if (user) {
      StorageService.addLog('Admin Logout', `Admin ${user.username} logged out`);
    }
    StorageService.clearAuthSession();
  }
}
