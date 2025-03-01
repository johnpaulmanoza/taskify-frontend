import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { List } from '../../types';

interface ListsState {
  lists: List[];
  loading: boolean;
  error: string | null;
}

const initialState: ListsState = {
  lists: [],
  loading: false,
  error: null,
};

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    fetchListsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchListsSuccess: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
      state.loading = false;
    },
    fetchListsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addList: (state, action: PayloadAction<List>) => {
      state.lists.push(action.payload);
    },
    updateList: (state, action: PayloadAction<List>) => {
      const index = state.lists.findIndex((list) => list.id === action.payload.id);
      if (index !== -1) {
        state.lists[index] = action.payload;
      }
    },
    deleteList: (state, action: PayloadAction<number>) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload);
    },
    reorderLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
    },
  },
});

export const {
  fetchListsStart,
  fetchListsSuccess,
  fetchListsFailure,
  addList,
  updateList,
  deleteList,
  reorderLists,
} = listsSlice.actions;

export default listsSlice.reducer;