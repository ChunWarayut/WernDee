import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { scheduleAPI } from '../../services/api';

export interface ScheduleAssignment {
  id: number;
  date: string;
  assignment_type: 'AUTOMATED' | 'MANUAL_SWAP';
  nurse: {
    id: number;
    first_name: string;
    last_name: string;
  };
  shift: {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
  };
}

interface ScheduleState {
  assignments: ScheduleAssignment[];
  currentMonth: string;
  isLoading: boolean;
  error: string | null;
  isGenerating: boolean;
}

const initialState: ScheduleState = {
  assignments: [],
  currentMonth: new Date().toISOString().substring(0, 7), // YYYY-MM format
  isLoading: false,
  error: null,
  isGenerating: false,
};

export const fetchSchedule = createAsyncThunk(
  'schedules/fetchSchedule',
  async (monthYear: string) => {
    return await scheduleAPI.getByMonth(monthYear);
  }
);

export const generateSchedule = createAsyncThunk(
  'schedules/generateSchedule',
  async (data: { startDate: string; endDate: string; monthYear: string }) => {
    return await scheduleAPI.generate(data);
  }
);

export const createAssignment = createAsyncThunk(
  'schedules/createAssignment',
  async (data: { date: string; nurse_id: number; shift_id: number }) => {
    return await scheduleAPI.createAssignment(data);
  }
);

export const updateAssignment = createAsyncThunk(
  'schedules/updateAssignment',
  async ({ id, data }: { id: number; data: Partial<ScheduleAssignment> }) => {
    return await scheduleAPI.updateAssignment(id, data);
  }
);

export const deleteAssignment = createAsyncThunk(
  'schedules/deleteAssignment',
  async (id: number) => {
    await scheduleAPI.deleteAssignment(id);
    return id;
  }
);

const scheduleSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentMonth: (state, action) => {
      state.currentMonth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch schedule';
      })
      .addCase(generateSchedule.pending, (state) => {
        state.isGenerating = true;
      })
      .addCase(generateSchedule.fulfilled, (state) => {
        state.isGenerating = false;
      })
      .addCase(generateSchedule.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.error.message || 'Failed to generate schedule';
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.assignments.push(action.payload);
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(assignment => assignment.id === action.payload.id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(assignment => assignment.id !== action.payload);
      });
  },
});

export const { clearError, setCurrentMonth } = scheduleSlice.actions;
export default scheduleSlice.reducer;