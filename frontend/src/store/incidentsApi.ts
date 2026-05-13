import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Incident {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  violationType: string;
  vehicleDesc?: string;
  recorderSpeed?: number | null; // m/s — recorder's vehicle speed at time of capture, not violating vehicle
  incidentAt: string;
  videoUrl: string;
  createdAt: string;
}

export interface SubmitResult {
  id: string;
  status: 'PUBLISHED' | 'PENDING_REVIEW' | 'REJECTED';
  message: string;
}

export const incidentsApi = createApi({
  reducerPath: 'incidentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL ?? ''}/api` }),
  tagTypes: ['Incidents'],
  endpoints: (builder) => ({
    getIncidents: builder.query<Incident[], void>({
      query: () => '/incidents',
      providesTags: ['Incidents'],
    }),
    getIncident: builder.query<Incident, string>({
      query: (id) => `/incidents/${id}`,
    }),
    submitIncident: builder.mutation<SubmitResult, FormData>({
      query: (formData) => ({
        url: '/incidents',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Incidents'],
    }),
  }),
});

export const { useGetIncidentsQuery, useGetIncidentQuery, useSubmitIncidentMutation } =
  incidentsApi;
