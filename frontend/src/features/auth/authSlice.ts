import { createSlice } from "@reduxjs/toolkit";
import { loadUser, loginUser } from "./authThunks";
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
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading.login = true;
                state.error.login = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading.login = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading.login = false;
                state.error.login = action.payload || "Login failed";
            });

        builder
            .addCase(loadUser.pending, (state) => {
                state.loading.me = true;
                state.error.me = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading.me = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading.me = false;
                state.error.me = action.payload || "Load user failed";
            });

    },
});

export default authSlice.reducer;