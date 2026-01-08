import type { LoginUserParams } from "@/features/auth/type";
import api from "./api";

const API_VERSION = "v1";

export const loginApi = (data: LoginUserParams) => {
    return api.post(`/api/${API_VERSION}/accounts/login/`, data);
};

export const loadUserApi = () => {
    return api.get(`/api/${API_VERSION}/accounts/me/`);
}