import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { requestAPI } from '../../services/api';

export interface Request {
  id: number;
  request_type: 'LEAVE' | 'SHIFT_EXCHANGE';
  status: 'PENDING_PEER_APPROVAL' | 'PENDING_ADMIN_APPROVAL' | 'APPROVED' | 'REJECTED';
  requester: {
    id: number;
    first_name: string;
    last_name: string;
  };
  target_nurse?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  source_assignment?: {
    id: number;
    date: string;
    shift: {
      name: string;
      start_time: string;
      end_time: string;
    };
  };
  target_assignment?: {
    id: number;
    date: string;
    shift: {
      name: string;
      start_time: string;
      end_time: string;
    };
  };
  leave_start_date?: string;
  leave_end_date?: string;
  createdAt: string;
}

interface RequestState {
  requests: Request[];
  myRequests: Request[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RequestState = {
  requests: [],
  myRequests: [],
  isLoading: false,
  error: null,
};

export const fetchRequests = createAsyncThunk('requests/fetchRequests', async () => {
  return await requestAPI.getAll();
});

export const fetchMyRequests = createAsyncThunk('requests/fetchMyRequests', async () => {
  return await requestAPI.getMy();
});

export const createLeaveRequest = createAsyncThunk(
  'requests/createLeaveRequest',
  async (data: { requester_id: number; leave_start_date: string; leave_end_date: string }) => {
    return await requestAPI.createLeaveRequest(data);
  }
);

export const createShiftExchangeRequest = createAsyncThunk(
  'requests/createShiftExchangeRequest',
  async (data: {
    requester_id: number;
    target_nurse_id: number;
    source_assignment_id: number;
    target_assignment_id: number;
  }) => {
    return await requestAPI.createShiftExchangeRequest(data);
  }
);

export const updateRequestStatus = createAsyncThunk(
  'requests/updateRequestStatus',
  async ({ id, status }: { id: number; status: string }) => {
    return await requestAPI.updateStatus(id, { status });
  }
);

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch requests';
      })
      .addCase(fetchMyRequests.fulfilled, (state, action) => {
        state.myRequests = action.payload;
      })
      .addCase(createLeaveRequest.fulfilled, (state, action) => {
        state.myRequests.unshift(action.payload);
      })
      .addCase(createShiftExchangeRequest.fulfilled, (state, action) => {
        state.myRequests.unshift(action.payload);
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const requestIndex = state.requests.findIndex(req => req.id === action.payload.id);
        if (requestIndex !== -1) {
          state.requests[requestIndex] = action.payload;
        }
        const myRequestIndex = state.myRequests.findIndex(req => req.id === action.payload.id);
        if (myRequestIndex !== -1) {
          state.myRequests[myRequestIndex] = action.payload;
        }
      });
  },
});

export const { clearError } = requestSlice.actions;
export default requestSlice.reducer;