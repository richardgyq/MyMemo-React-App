import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "memoListOptions",
  initialState: {
    sorting: {
      by: "created",
      desc: true,
    },
    filterText: "",
    showFavouritesOnly: false,
  },
  reducers: {
    // Actions
    actionSortFieldSelected: (state, action) => {
      state.sorting.by = action.payload;
    },
    actionToggleSortDirection: (state, action) => {
      state.sorting.desc = !state.sorting.desc;
    },
    actionFilterTextChanged: (state, action) => {
      state.filterText = action.payload;
    },
    actionToggleFavourites: (state) => {
      state.showFavouritesOnly = !state.showFavouritesOnly;
    },
  },
});

// Actions
export const {
  actionSortFieldSelected,
  actionToggleSortDirection,
  actionFilterTextChanged,
  actionToggleFavourites,
} = slice.actions;

export default slice.reducer;

// selectors
export const selectListOptions = (state) => state.memoListOptionsSlice;
