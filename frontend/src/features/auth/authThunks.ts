import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginUserPayload, User } from "./type";
import { loadUserApi, loginApi } from "@/services/auth";
import type { AxiosError } from "axios";


export const loginUser = createAsyncThunk<
    User,
    LoginUserPayload,
    { rejectValue: string }
>(
    "auth/loginUser",
    async (params, { rejectWithValue }) => {
        try {
            const response = await loginApi(params);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string; status?: number; }>;
            return rejectWithValue(axiosError?.response?.data?.message || "Login failed");
        }
    }
);

export const loadUser = createAsyncThunk<
    User,
    void,
    { rejectValue: string }
>(
    "auth/loadUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await loadUserApi();
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string; status?: number; }>;
            return rejectWithValue(axiosError?.response?.data?.message || "Load user failed");
        }
    }
);