import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null
}

export const navSlice = createSlice({
    name: "nav",
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },

    },
});

export const { 
    setCurrentUser,
} = navSlice.actions;

export const selectCurrentUser = (state: any) => state.nav.currentUser;

export default navSlice.reducer;
