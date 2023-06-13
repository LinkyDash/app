import { createSlice } from '@reduxjs/toolkit';

const tabSlice = createSlice({
  name: 'tab',
  initialState: {name: 'Home'},
  reducers: {
    activeTab: (state, action) => {
        state = {name: action.payload};
        return state;
    },
  },
});

export const { activeTab } = tabSlice.actions;
export default tabSlice.reducer;