import { createSlice } from "@reduxjs/toolkit";
import { loadUser, loginUser, logoutUser, refreshToken, registerUser } from "./authThunks";
import { logoutUserSync } from "./authActions";
import type { AuthState } from "./type";

const initialState: AuthState = {
    user: null,
    loading: {
        login: false,
        register: false,
        logout: false,
        me: true,
    },
    error: {
        login: null,
        register: null,
        logout: null,
        me: null,
    },
    isAuthenticated: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logoutUserSync: logoutUserSync,
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading.login = true;
                state.error.login = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading.login = false;
                state.user = action.payload.data.user;
                state.isAuthenticated = true;
                localStorage.setItem("access_token", action.payload.data.tokens.access);
                localStorage.setItem("refresh_token", action.payload.data.tokens.refresh);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading.login = false;
                state.error.login = action.payload || "Login failed";
            });

        builder
            .addCase(registerUser.pending, (state) => {
                state.loading.register = true;
                state.error.register = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading.register = false;
                state.user = action.payload.data.user;
                state.isAuthenticated = true;
                localStorage.setItem("access_token", action.payload.data.tokens.access);
                localStorage.setItem("refresh_token", action.payload.data.tokens.refresh);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading.register = false;
                state.error.register = action.payload || "Registration failed";
            });

        builder
            .addCase(loadUser.pending, (state) => {
                state.loading.me = true;
                state.error.me = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading.me = false;
                state.user = action.payload.data;
                state.isAuthenticated = true;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading.me = false;
                state.error.me = action.payload || "Load user failed";
            });

        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading.logout = true;
                state.error.logout = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                console.log("Logout successful");
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading.logout = false;
                state.error.logout = action.payload || "Logout failed";
            });

        builder
            .addCase(refreshToken.fulfilled, (_, action) => {
                localStorage.setItem("access_token", action.payload?.access);
            })

    },
});

export default authSlice.reducer;