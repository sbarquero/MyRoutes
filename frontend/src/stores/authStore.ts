import { defineStore } from 'pinia';
import type {
  AuthResponseDto,
  LoginUserDto,
  RefreshTokenDto,
  RegisterUserDto,
  Session,
} from '@/interfaces/auth.interface';
import authApi from '@/api/authApi';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    status: 'authenticating',
    userName: '',
    email: '',
    rol: '',
    token: '',
    userId: '',
    sessionId: '',
    refreshToken: '',
    expireAt: new Date(0),
    form: 'login',
  }),
  getters: {
    isAuthenticated: state => state.status === 'authenticated',
    isAdmin: state => state.rol === 'admin',
  },
  actions: {
    async init() {
      this.userId = sessionStorage.getItem('userId') || '';
      this.sessionId = sessionStorage.getItem('sessionId') || '';
      this.refreshToken = sessionStorage.getItem('refreshToken') || '';
      this.rol = sessionStorage.getItem('rol') || '';
    },
    async login(user: LoginUserDto) {
      this.status = 'authenticating';
      const { email, password } = user;
      try {
        const { data } = await authApi.post('/login', { email, password });
        this.createSession(data);

        return { ok: true, message: data.userName };
      } catch (error: any) {
        this.status = 'not-authenticated';
        return { ok: false, message: error.response.data.message };
      }
    },
    async logout() {
      try {
        await authApi.post('/logout', {
          userId: this.userId,
          sessionId: this.sessionId,
          refreshToken: this.refreshToken,
        });

        return { ok: true, message: 'Successfully logged out' };
      } catch (error: any) {
        return { ok: false, message: error.response.data.message };
      } finally {
        this.removeSession();
        this.status = 'not-authenticated';
      }
    },
    async getToken() {
      if (isTokenExpired(this.token)) {
        await this.refresh();
      }
      return this.token;
    },
    async refresh() {
      this.status = 'authenticating';
      const hasRefreshToken = sessionStorage.getItem('refreshToken') != '';
      if (!hasRefreshToken) return;
      try {
        const { data } = await authApi.post('/refresh', {
          userId: sessionStorage.getItem('userId'),
          sessionId: sessionStorage.getItem('sessionId'),
          refreshToken: sessionStorage.getItem('refreshToken'),
        } as RefreshTokenDto);

        this.createSession(data);

        return { ok: true };
      } catch (error: any) {
        this.removeSession();
        this.status = 'not-authenticated';
        return { ok: false, message: error.response.data.message };
      }
    },
    createSession(user: AuthResponseDto): void {
      const { userName, email, rol, token, userId, sessionId, refreshToken, expireAt } = user;

      if (token) {
        this.userName = userName;
        this.email = email;
        this.token = token;
        this.rol = rol;
        this.userId = userId;
        this.sessionId = sessionId;
        this.refreshToken = refreshToken;
        this.expireAt = expireAt;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('sessionId', sessionId);
        sessionStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('rol', rol);
        this.status = 'authenticated';
      }
    },
    removeSession() {
      this.userName = '';
      this.email = '';
      this.token = '';
      this.rol = '';
      this.userId = '';
      this.sessionId = '';
      this.expireAt = new Date();
      this.refreshToken = '';
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('sessionId');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('rol');
    },
    async rejectSession(userId: string, session: Session) {
      try {
        const path = 'reject';
        const request = {
          userId,
          sessionId: session._id,
          refreshToken: session.refreshToken,
        };
        const token = await this.getToken();
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        const response = await authApi.post(path, request, headers);

        return { ok: true, message: response.data.data._id };
      } catch (error: any) {
        return { ok: false, message: error.response.data.message };
      }
    },
    async register(user: RegisterUserDto) {
      try {
        const path = 'register';
        await authApi.post(path, user);

        return { ok: true };
      } catch (error: any) {
        console.error('error', error.message);
        return { ok: false, message: error.response.data.message };
      }
    },
  },
});

function isTokenExpired(token: string) {
  const expiry = JSON.parse(atob(token.split('.')[1])).exp;
  return Math.floor(new Date().getTime() / 1000) >= expiry;
}
