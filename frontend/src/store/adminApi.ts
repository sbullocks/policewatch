import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface PendingIncident {
  id: string;
  videoUrl: string;
  latitude: number;
  longitude: number;
  address: string;
  violationType: string;
  vehicleDesc?: string;
  incidentAt: string;
  aiConfidence: string;
  aiReasoning: string;
  createdAt: string;
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL ?? ''}/api/admin`,
    prepareHeaders: (headers, { extra }) => {
      const password = (extra as { password?: string })?.password;
      if (password) headers.set('x-admin-password', password);
      return headers;
    },
  }),
  tagTypes: ['Pending'],
  endpoints: (builder) => ({
    getPending: builder.query<PendingIncident[], string>({
      query: (password) => ({
        url: '/pending',
        extraOptions: { password },
        headers: { 'x-admin-password': password },
      }),
      providesTags: ['Pending'],
    }),
    approveIncident: builder.mutation<void, { id: string; password: string }>({
      query: ({ id, password }) => ({
        url: `/${id}/approve`,
        method: 'PATCH',
        headers: { 'x-admin-password': password },
      }),
      invalidatesTags: ['Pending'],
    }),
    rejectIncident: builder.mutation<void, { id: string; password: string }>({
      query: ({ id, password }) => ({
        url: `/${id}/reject`,
        method: 'PATCH',
        headers: { 'x-admin-password': password },
      }),
      invalidatesTags: ['Pending'],
    }),
  }),
});

export const { useGetPendingQuery, useApproveIncidentMutation, useRejectIncidentMutation } = adminApi;
