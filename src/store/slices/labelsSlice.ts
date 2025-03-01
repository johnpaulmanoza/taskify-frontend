import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Label, CardLabel } from '../../types';

interface LabelsState {
  labels: Label[];
  cardLabels: CardLabel[];
  loading: boolean;
  error: string | null;
}

const initialState: LabelsState = {
  labels: [],
  cardLabels: [],
  loading: false,
  error: null,
};

const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    fetchLabelsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLabelsSuccess: (state, action: PayloadAction<Label[]>) => {
      state.labels = action.payload;
      state.loading = false;
    },
    fetchLabelsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCardLabelsSuccess: (state, action: PayloadAction<CardLabel[]>) => {
      state.cardLabels = action.payload;
    },
    addLabel: (state, action: PayloadAction<Label>) => {
      state.labels.push(action.payload);
    },
    updateLabel: (state, action: PayloadAction<Label>) => {
      const index = state.labels.findIndex((label) => label.id === action.payload.id);
      if (index !== -1) {
        state.labels[index] = action.payload;
      }
    },
    deleteLabel: (state, action: PayloadAction<number>) => {
      state.labels = state.labels.filter((label) => label.id !== action.payload);
      state.cardLabels = state.cardLabels.filter((cl) => cl.label_id !== action.payload);
    },
    addCardLabel: (state, action: PayloadAction<CardLabel>) => {
      state.cardLabels.push(action.payload);
    },
    removeCardLabel: (state, action: PayloadAction<CardLabel>) => {
      state.cardLabels = state.cardLabels.filter(
        (cl) => !(cl.card_id === action.payload.card_id && cl.label_id === action.payload.label_id)
      );
    },
  },
});

export const {
  fetchLabelsStart,
  fetchLabelsSuccess,
  fetchLabelsFailure,
  fetchCardLabelsSuccess,
  addLabel,
  updateLabel,
  deleteLabel,
  addCardLabel,
  removeCardLabel,
} = labelsSlice.actions;

export default labelsSlice.reducer;