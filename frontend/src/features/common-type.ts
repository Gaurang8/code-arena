export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    success: boolean;
    message: string;
    errors?: string[] | Record<string, unknown>;
}

export interface Tokens {
    access: string;
    refresh: string;
}