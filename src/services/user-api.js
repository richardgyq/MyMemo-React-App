import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl, addAuthHeader } from "services/api-helper";

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl("users"),
    prepareHeaders: (headers) => {
      return addAuthHeader(headers);
    },
  }),

  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data) => ({
        url: "signup/",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "login/",
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query(id) {
        return {
          url: "logout/",
          method: "POST",
        };
      },
    }),
  }),
});

export const { useLoginMutation, useSignUpMutation, useLogoutMutation } =
  userApi;
