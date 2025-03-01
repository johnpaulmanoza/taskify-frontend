import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Card } from '../../types';

interface CardsState {
  cards: Card[];
  currentCard: Card | null;
  loading: boolean;
  error: string | null;
}

const initialState: CardsState = {
  cards: [],
  currentCard: null,
  loading: false,
  error: null,
};

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    fetchCardsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCardsSuccess: (state, action: PayloadAction<Card[]>) => {
      state.cards = action.payload;
      state.loading = false;
    },
    fetchCardsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentCard: (state, action: PayloadAction<Card | null>) => {
      state.currentCard = action.payload;
    },
    addCard: (state, action: PayloadAction<Card>) => {
      state.cards.push(action.payload);
    },
    updateCard: (state, action: PayloadAction<Card>) => {
      const index = state.cards.findIndex((card) => card.id === action.payload.id);
      if (index !== -1) {
        state.cards[index] = action.payload;
        if (state.currentCard?.id === action.payload.id) {
          state.currentCard = action.payload;
        }
      }
    },
    deleteCard: (state, action: PayloadAction<number>) => {
      state.cards = state.cards.filter((card) => card.id !== action.payload);
      if (state.currentCard?.id === action.payload) {
        state.currentCard = null;
      }
    },
    reorderCards: (state, action: PayloadAction<Card[]>) => {
      // Update multiple cards at once (for drag and drop reordering)
      const updatedCards = action.payload;
      updatedCards.forEach((updatedCard) => {
        const index = state.cards.findIndex((card) => card.id === updatedCard.id);
        if (index !== -1) {
          state.cards[index] = updatedCard;
        }
      });
    },
  },
});

export const {
  fetchCardsStart,
  fetchCardsSuccess,
  fetchCardsFailure,
  setCurrentCard,
  addCard,
  updateCard,
  deleteCard,
  reorderCards,
} = cardsSlice.actions;

export default cardsSlice.reducer;