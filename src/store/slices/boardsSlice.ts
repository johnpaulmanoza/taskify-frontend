import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board } from '../../types';

interface BoardsState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
};

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    fetchBoardsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBoardsSuccess: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
      state.loading = false;
    },
    fetchBoardsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentBoard: (state, action: PayloadAction<Board>) => {
      state.currentBoard = action.payload;
    },
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
    },
    updateBoard: (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex((board) => board.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
        if (state.currentBoard?.id === action.payload.id) {
          state.currentBoard = action.payload;
        }
      }
    },
    deleteBoard: (state, action: PayloadAction<number>) => {
      state.boards = state.boards.filter((board) => board.id !== action.payload);
      if (state.currentBoard?.id === action.payload) {
        state.currentBoard = null;
      }
    },
  },
});

export const {
  fetchBoardsStart,
  fetchBoardsSuccess,
  fetchBoardsFailure,
  setCurrentBoard,
  addBoard,
  updateBoard,
  deleteBoard,
} = boardsSlice.actions;

export default boardsSlice.reducer;