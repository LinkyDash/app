import { createSlice } from '@reduxjs/toolkit';

const tabsSlice = createSlice({
  name: 'tabs',
  initialState: [],
  reducers: {
    openTab: (state, action) => {
        state = [...state, action.payload];
        return state;
    },
    closeTab: (state, action) => {
        const index = state.indexOf(action.payload);
        state.splice(index, 1);
        return state;
    },
  },
});

export const { openTab, closeTab } = tabsSlice.actions;
export default tabsSlice.reducer;