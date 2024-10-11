import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ownerId: '',
    ownerName: '',
    email: '',
    phoneNumber: '',
    photoUrl: '',
    accessToken: '',
    expiresIn: ''
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authData: initialState
    },
    reducers: {
        addAuth: (state, action) => {
            state.authData = action.payload
        },
        removeAuth: (state) => {
            state.authData = initialState
        }
    }
})

export const { addAuth, removeAuth } = authSlice.actions;
export default authReducer = authSlice.reducer;
// export const authSelector = (state) => state.authReducer.authData
