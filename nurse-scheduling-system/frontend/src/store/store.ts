import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import nurseReducer from './slices/nurseSlice';
import scheduleReducer from './slices/scheduleSlice';
import requestReducer from './slices/requestSlice';
import shiftReducer from './slices/shiftSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    nurses: nurseReducer,
    schedules: scheduleReducer,
    requests: requestReducer,
    shifts: shiftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;