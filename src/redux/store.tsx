import { configureStore } from '@reduxjs/toolkit';

// Imported reducers
import tabsReducer from './reducers/tabs';
import tabReducer from './reducers/tab';
import pagesReducer from './reducers/pages';
import timeReducer from './reducers/time';
import dbUserReducer from './reducers/dbUser';
import pageReducer from './reducers/page';

export const store = configureStore({
  reducer: {
    tabs: tabsReducer,
    tab: tabReducer,
    pages: pagesReducer,
    time: timeReducer,
    dbUser: dbUserReducer,
    page: pageReducer,
  },
});
