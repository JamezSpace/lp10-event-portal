interface Admin {
    email: string,
    password: string
}

interface AuthResponse {
    success: 0 | 1;
    reason?: string;
}

export type {
    Admin, AuthResponse
}