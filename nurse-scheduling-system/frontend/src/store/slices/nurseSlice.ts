import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { nurseAPI } from '../../services/api';

export interface Nurse {
  id: number;
  first_name: string;
  last_name: string;
  qualification: 'RN' | 'PN';
  special_condition: 'NONE' | 'HEAD_NURSE' | 'SENIOR' | 'PREGNANT';
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

interface NurseState {
  nurses: Nurse[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NurseState = {
  nurses: [],
  isLoading: false,
  error: null,
};

export const fetchNurses = createAsyncThunk('nurses/fetchNurses', async () => {
  return await nurseAPI.getAll();
});

export const createNurse = createAsyncThunk(
  'nurses/createNurse',
  async (nurseData: Omit<Nurse, 'id' | 'user'>) => {
    return await nurseAPI.create(nurseData);
  }
);

export const updateNurse = createAsyncThunk(
  'nurses/updateNurse',
  async ({ id, data }: { id: number; data: Partial<Nurse> }) => {
    return await nurseAPI.update(id, data);
  }
);

export const deleteNurse = createAsyncThunk(
  'nurses/deleteNurse',
  async (id: number) => {
    await nurseAPI.delete(id);
    return id;
  }
);

const nurseSlice = createSlice({
  name: 'nurses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNurses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNurses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nurses = action.payload;
      })
      .addCase(fetchNurses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch nurses';
      })
      .addCase(createNurse.fulfilled, (state, action) => {
        state.nurses.push(action.payload);
      })
      .addCase(updateNurse.fulfilled, (state, action) => {
        const index = state.nurses.findIndex(nurse => nurse.id === action.payload.id);
        if (index !== -1) {
          state.nurses[index] = action.payload;
        }
      })
      .addCase(deleteNurse.fulfilled, (state, action) => {
        state.nurses = state.nurses.filter(nurse => nurse.id !== action.payload);
      });
  },
});

export const { clearError } = nurseSlice.actions;
export default nurseSlice.reducer;