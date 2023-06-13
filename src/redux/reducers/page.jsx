import { createSlice } from '@reduxjs/toolkit';

const pageSlice = createSlice({
    name: 'page',
    initialState: {status: false},
    reducers: {
        setPage: (state, action) => {
            state = { ...action.payload, status: false };
            return state;
        },
        requestPageData: (state) => {
            state.status = false
        },
        endPageRequest: (state) => {
            state.status = true
        }
    },
});

export const { setPage, requestPageData, endPageRequest } = pageSlice.actions;
export default pageSlice.reducer;