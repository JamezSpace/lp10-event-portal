interface Admin {
    email: string,
    password: string
}

interface AuthResponse {
    success: 0 | 1;
    reason?: string;
}

export enum UserType {
    ADMIN, USER
}

export type {
    Admin, AuthResponse
}