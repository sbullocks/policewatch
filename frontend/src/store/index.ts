import { configureStore } from '@reduxjs/toolkit';
import { incidentsApi } from './incidentsApi';
import { adminApi } from './adminApi';

export const store = configureStore({
  reducer: {
    [incidentsApi.reducerPath]: incidentsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(incidentsApi.middleware)
      .concat(adminApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
