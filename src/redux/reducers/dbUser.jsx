import { createSlice } from '@reduxjs/toolkit';

const dbUserSlice = createSlice({
    name: 'dbUser',
    initialState: {apiStatus: false},
    reducers: {
        setDbUser: (state, action) => {
            state = action.payload
            return state
        },
    },
});

export const { setDbUser } = dbUserSlice.actions;
export default dbUserSlice.reducer;