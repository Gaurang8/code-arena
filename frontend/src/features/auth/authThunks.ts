import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginResponse, LoginUserPayload, RegisterUserPayload, User } from "./type";
import { loadUserApi, loginApi, logoutApi, refreshTokenApi, registerApi } from "@/services/auth";
import type { ApiResponse } from "@/features/common-type";
import { formatErrorMessage } from "@/lib/generalFun";
import type { AxiosError } from "axios";


export const loginUser = createAsyncThunk<
    ApiResponse<LoginResponse>,
    LoginUserPayload,
    { rejectValue: string }
>(
    "auth/loginUser",
    async (params, { rejectWithValue }) => {
        try {
            const response = await loginApi(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(formatErrorMessage(error as AxiosError, "Login failed"));
        }
    }
);

export const registerUser = createAsyncThunk<
    ApiResponse<LoginResponse>,
    RegisterUserPayload,
    { rejectValue: string }
>(
    "auth/registerUser",
    async (params, { rejectWithValue }) => {
        try {
            const response = await registerApi(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(formatErrorMessage(error as AxiosError, "Registration failed"));
        }
    }
);

export const loadUser = createAsyncThunk<
    ApiResponse<User>,
    void,
    { rejectValue: string }
>(
    "auth/loadUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await loadUserApi();
            return response.data;
        } catch (error) {
            return rejectWithValue(formatErrorMessage(error as AxiosError, "Load user failed"));
        }
    }
);

export const logoutUser = createAsyncThunk<
    ApiResponse<void>,
    void,
    { rejectValue: string }
>(
    "auth/logoutUser", async (_, { rejectWithValue }) => {
        try {
            const response = await logoutApi();
            return response.data;
        } catch (error) {
            console.log("Logout error:", error);
            return rejectWithValue(formatErrorMessage(error as AxiosError, "Logout failed"));
        }
    }
);

export const refreshToken = createAsyncThunk<
    {
        access: string;
    },
    void,
    { rejectValue: string }
>(
    "auth/refreshToken", async (_, { rejectWithValue }) => {
        try {
            const response = await refreshTokenApi();
            return response.data as { access: string };
        } catch (error) {
            return rejectWithValue(formatErrorMessage(error as AxiosError, "Token refresh failed"));
        }
    }
);