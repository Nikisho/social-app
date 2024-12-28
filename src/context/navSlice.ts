import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: {
        name: null,
        email: null,
        photo:null,
        id: null,
        sex: null
    }
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
