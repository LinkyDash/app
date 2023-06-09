import { createSlice } from '@reduxjs/toolkit';

const tabSlice = createSlice({
  name: 'tab',
  initialState: {activeTab: null},
  reducers: {
    activeTab: (state, action) => {
        state = {activeTab: action.payload};
        return state;
    },
  },
});

export const { activeTab } = tabSlice.actions;
export default tabSlice.reducer;