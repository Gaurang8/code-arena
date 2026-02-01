// Standalone sync actions to avoid circular dependencies
export const logoutUserSync = (state: any) => {
    state.user = null;
    state.isAuthenticated = false;
    state.error = {
        login: null,
        register: null,
        logout: null,
        me: null,
    };
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};
