import type { LoginUserPayload, RegisterUserPayload } from "@/features/auth/type";
import api from "./api";
import axios from "axios";

const API_VERSION = "v1";

export const loginApi = (data: LoginUserPayload) => {
    return axios.post(`${import.meta.env.SERVER_BASE_URL || "http://localhost:8000"}/api/${API_VERSION}/accounts/login/`, data);
};

export const registerApi = (data: RegisterUserPayload) => {
    return axios.post(`${import.meta.env.SERVER_BASE_URL || "http://localhost:8000"}/api/${API_VERSION}/accounts/register/`, data);
}

export const loadUserApi = () => {
    return api.get(`/api/${API_VERSION}/accounts/me/`);
}

export const logoutApi = () => {
    const refreshToken = localStorage.getItem("refresh_token");
    return api.post(`/api/${API_VERSION}/accounts/logout/`, { refresh: refreshToken });
}

export const refreshTokenApi = () => {
    const refreshToken = localStorage.getItem("refresh_token");
    return axios.post(`${import.meta.env.SERVER_BASE_URL || "http://localhost:8000"}/api/${API_VERSION}/accounts/token/refresh/`, {
        refresh: refreshToken,
    });
}