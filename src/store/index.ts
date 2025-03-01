import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import boardsReducer from './slices/boardsSlice';
import listsReducer from './slices/listsSlice';
import cardsReducer from './slices/cardsSlice';
import labelsReducer from './slices/labelsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
    lists: listsReducer,
    cards: cardsReducer,
    labels: labelsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;