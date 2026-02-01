import axios from "axios";
// import { store } from "@/app/store";

const api = axios.create({
    baseURL: import.meta.env.SERVER_BASE_URL || "http://localhost:8000",
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response, config } = error;

        if (response?.status === 401 && !config._retry && localStorage.getItem("refresh_token")) {
            config._retry = true;

            // If already refreshing, wait for it to complete
            if (isRefreshing && refreshPromise) {
                try {
                    const newToken = await refreshPromise;
                    if (newToken) {
                        config.headers["Authorization"] = `Bearer ${newToken}`;
                        return api(config);
                    }
                } catch (err) {
                    return Promise.reject(err);
                }
            }

            // Start refresh
            isRefreshing = true;
            refreshPromise = (async () => {
                try {
                    const refreshToken = localStorage.getItem("refresh_token");
                    const response = await axios.post(
                        `${import.meta.env.SERVER_BASE_URL || "http://localhost:8000"}/api/v1/accounts/token/refresh/`,
                        { refresh: refreshToken }
                    );

                    const { access } = response.data;
                    localStorage.setItem("access_token", access);

                    api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
                    config.headers["Authorization"] = `Bearer ${access}`;

                    return access;
                } catch {
                    // Refresh failed - logout user
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");

                    // Dispatch logout action
                    // store.dispatch({ type: "auth/logoutUserSync" });

                    window.location.href = "/login";
                    return null;
                } finally {
                    isRefreshing = false;
                    refreshPromise = null;
                }
            })();

            try {
                const newToken = await refreshPromise;
                if (newToken) {
                    return api(config);
                }
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
