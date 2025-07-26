import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { shiftAPI } from '../../services/api';

export interface Shift {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
}

interface ShiftState {
  shifts: Shift[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ShiftState = {
  shifts: [],
  isLoading: false,
  error: null,
};

export const fetchShifts = createAsyncThunk('shifts/fetchShifts', async () => {
  return await shiftAPI.getAll();
});

export const initializeShifts = createAsyncThunk('shifts/initializeShifts', async () => {
  return await shiftAPI.initialize();
});

const shiftSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShifts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shifts = action.payload;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch shifts';
      })
      .addCase(initializeShifts.fulfilled, (state) => {
        // Refresh shifts after initialization
      });
  },
});

export const { clearError } = shiftSlice.actions;
export default shiftSlice.reducer;