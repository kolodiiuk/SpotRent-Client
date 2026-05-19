import { User } from "./user.model";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken?: string;
}

export interface LogoutRequest {
    refreshToken?: string;
}

export interface GoogleSignInRequest {
    idToken: string;
}

export interface LoginResponse {
    token: string;
    refreshToken?: string;
    expiration: string;
    user: User;
}
