import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl, addAuthHeader } from "services/api-helper";

const CACHE_TAG_MEMOS = "Memos";
const CACHE_ID_LIST = "LIST";

export const myMemoApi = createApi({
  reducerPath: "myMemoApi",

  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl("mymemos"),
    prepareHeaders: (headers) => {
      return addAuthHeader(headers);
    },
  }),

  tagTypes: [CACHE_TAG_MEMOS],
  endpoints: (builder) => ({
    getMemos: builder.query({
      query: () => "",
      // Provides a list of `Memos` by `id`.
      // If any mutation is executed that `invalidate`s any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Memo` element was added.
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: CACHE_TAG_MEMOS, id })),
              { type: CACHE_TAG_MEMOS, id: CACHE_ID_LIST },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Memos', id: 'LIST' }` is invalidated
            [{ type: CACHE_TAG_MEMOS, id: CACHE_ID_LIST }],
    }),

    getMemo: builder.query({
      query: (id) => `${id}/`,
      providesTags: (result) =>
        result ? [{ type: CACHE_TAG_MEMOS, id: result.id }] : [],
    }),

    createMemo: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      // Invalidates all Memos-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created memo could show up in any lists.
      invalidatesTags: [{ type: CACHE_TAG_MEMOS, id: CACHE_ID_LIST }],
    }),

    updateMemo: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `${id}/`,
        method: "PUT",
        body: patch,
      }),
      // Invalidates all queries that subscribe to this Memo `id` only.
      // In this case, `getMemo` will be re-run. `getMemos` *might*  rerun, if this id was under its results.
      invalidatesTags: (_result, _error, { id }) => [
        { type: CACHE_TAG_MEMOS, id },
      ],
    }),

    deleteMemo: builder.mutation({
      query(id) {
        return {
          url: `${id}/`,
          method: "DELETE",
        };
      },
      // Invalidates all queries that subscribe to this Memo `id` only.
      invalidatesTags: (_result, _error, id) => [{ type: CACHE_TAG_MEMOS, id }],
    }),

    toggleStar: builder.mutation({
      query(id) {
        return {
          url: `${id}/favourite/`,
          method: "PATCH",
        };
      },
      // Invalidates all queries that subscribe to this Memo `id` only.
      invalidatesTags: (_result, _error, id) => [{ type: CACHE_TAG_MEMOS, id }],
    }),
  }),
});

export const {
  useGetMemoQuery,
  useGetMemosQuery,
  useCreateMemoMutation,
  useUpdateMemoMutation,
  useDeleteMemoMutation,
  useToggleStarMutation,
} = myMemoApi;
