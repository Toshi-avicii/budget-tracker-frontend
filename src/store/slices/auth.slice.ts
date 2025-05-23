import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string;
}

const initialState: AuthState = {
    token: ''
}

const authSlice = createSlice({
    initialState,
    name: "auth",
    reducers: {
        save: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        remove: (state) => {
            state.token = '';
        }
    }
});

export const { remove, save } = authSlice.actions;
export default authSlice.reducer;