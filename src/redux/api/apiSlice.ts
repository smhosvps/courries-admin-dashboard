import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8400/api/v1/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include", // This allows the browser to send cookies with requests
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string; user: any },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "login-admin",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
    getUser: builder.query<any, void>({
      query: () => "user",
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
} = api;
