import { createSlice } from '@reduxjs/toolkit';

const pagesSlice = createSlice({
    name: 'pages',
    initialState: {
        status: false,
        data: [],
    },
    reducers: {
        updatePages: (state, action) => {
        state.status = true;
        state.data = action.payload;
        },
        deletePages: (state) => {
        state.status = false;
        state.data = [];
        },
    },
});

export const { updatePages, deletePages } = pagesSlice.actions;
export default pagesSlice.reducer;