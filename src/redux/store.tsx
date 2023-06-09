import { configureStore } from '@reduxjs/toolkit';

// Imported reducers
import tabsReducer from './reducers/tabs';
import tabReducer from './reducers/tab';

export const store = configureStore({
  reducer: {
    tabs: tabsReducer,
    tab: tabReducer,
    // Add other reducers here
  },
});
