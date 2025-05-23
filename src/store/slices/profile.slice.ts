import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
    username: string;
    email: string;
    dp: string;
    isSignedUpWithGoogle: boolean | null;
};

const initialState: ProfileState = {
    username: '',
    dp: '',
    email: '',
    isSignedUpWithGoogle: null
}

const profileSlice = createSlice({
    initialState,
    name: 'profile',
    reducers: {
        changeProfileWhenRegister: (state, action: PayloadAction<{ email: string, username:string, isSignedUpWithGoogle: boolean }>) => {
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.isSignedUpWithGoogle = action.payload.isSignedUpWithGoogle || false;
        },
        removeProfile: (state) => {
            state.dp = '';
            state.email = '';
            state.username = '';
            state.isSignedUpWithGoogle = null;
        },
        changeProfileWhenGoogleSignIn: (state, action: PayloadAction<{ email: string, username: string, isSignedUpWithGoogle: boolean, avatarUrl: string }>) => {
            state.dp = action.payload.avatarUrl;
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.isSignedUpWithGoogle = action.payload.isSignedUpWithGoogle;
        }
    }
});

export const { changeProfileWhenRegister, removeProfile, changeProfileWhenGoogleSignIn } = profileSlice.actions;
export default profileSlice.reducer;