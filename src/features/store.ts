import { configureStore } from '@reduxjs/toolkit';
import skillsReducer from './skills/skillsSlice';
import themeReducer from './theme/themeSlice';

export const store = configureStore({
  reducer: {
    skills: skillsReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 