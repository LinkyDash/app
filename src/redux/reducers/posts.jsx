import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
    name: 'posts',
    initialState: [],
    reducers: {
        setPosts: (state, action) => {
            state =  action.payload ;
            return state;
        }
    },
});

export const { setPosts } = postsSlice.actions;
export default postsSlice.reducer;