export interface Session {
  _id?: string;
  refreshToken: string;
  createAt: Date;
  expireAt: Date;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  userId: string;
  sessionId: string;
  refreshToken: string;
}

export interface AuthResponseDto {
  userId: string;
  userName: string;
  email: string;
  rol: string;
  token: string;
  sessionId: string;
  refreshToken: string;
  expireAt: Date;
}

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}
