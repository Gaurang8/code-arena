import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.SERVER_BASE_URL || "http://localhost:8000",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const csrfToken = document.cookie
        .split("; ")
        .find((c) => c.startsWith("csrftoken="))
        ?.split("=")[1];

    if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {

        const originalRequest = error.config;

        const { response } = error;
        if (response && response.status === 403) {
            if (response.data.detail.includes("Authentication credentials were not provided.")) {
                return Promise.reject(error);
            }
            originalRequest._retry = true;
            await api.get("/api/v1/accounts/csrf/");
            return api(originalRequest);
        }
    }
);

export default api;
