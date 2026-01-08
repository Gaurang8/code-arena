import api from "./api";

export const initCSRF = () => api.get("/api/v1/accounts/csrf/");