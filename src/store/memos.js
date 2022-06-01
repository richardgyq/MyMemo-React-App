import {
    createSlice
} from '@reduxjs/toolkit';
import api from 'services/api-client';

const slice = createSlice({
    name: "sliceMemos",
    initialState: {
        memoList: [],
        isProcessing: false,
        error: '',
    },
    reducers: {
        // Action creators
        actionStartProcessing: state => {
            state.isProcessing = true;
            state.error = '';
        },
        actionEndProcessing: state => {
            state.isProcessing = false;
        },
        actionErrorOcurred: (state, action) => {
            state.error = action.payload;
        },
        actionDataLoaded: (state, action) => {
            state.memoList = action.payload;
        },
        actionStarToggled: (state, action) => {
            let theMemo = state.memoList.find(
                memo => memo.id === action.payload
            );
            theMemo.favourite = !theMemo.favourite;
        },
        actionMemoUpdated: (state, action) => {
            let theMemo = state.memoList.find(
                memo => memo.id === action.payload.id
            );
            Object.assign(theMemo, action.payload);
        },
        actionMemoCreated: (state, action) => {
            state.memoList.splice(0, 0, action.payload);
        },
    }
});

// Actions

const {
    actionStartProcessing,
    actionEndProcessing,
    actionDataLoaded,
    actionErrorOcurred,
    actionStarToggled,
    actionMemoCreated,
    actionMemoUpdated,
} = slice.actions;

// Thunks
export const thunkLoadMemos = () => dispatch => {
    dispatch(actionStartProcessing());

    api.get('mymemos/').then(
        response => dispatch(actionDataLoaded(response.data)),
        error => {
            const message = error.response?.data?.error || error.message;
            dispatch(actionErrorOcurred(message));
        }
    ).finally(
        () => dispatch(actionEndProcessing())
    );
};

export const thunkDeleteMemo = (id) => dispatch => {
    dispatch(actionStartProcessing());

    api.delete(`mymemos/${id}/`).then(
        response => dispatch(thunkLoadMemos()),
        error => {
            const message = error.response?.data?.error || error.message;
            dispatch(actionErrorOcurred(message));
        }
    ).finally(
        () => dispatch(actionEndProcessing())
    );
};

export const thunkToggleStar = (id) => dispatch => {
    dispatch(actionStartProcessing());

    api.put(`mymemos/${id}/favourite/`).then(
        response => dispatch(actionStarToggled(id)),
        error => {
            const message = error.response?.data?.error || error.message;
            dispatch(actionErrorOcurred(message));
        }
    ).finally(
        () => dispatch(actionEndProcessing())
    )
};

export const thunkCreateMemo = data => dispatch => {
    dispatch(actionStartProcessing());

    api.post('mymemos/', data).then(
        response => dispatch(actionMemoCreated(response.data)),
        error => {
            const message = error.response?.data?.error || error.message;
            dispatch(actionErrorOcurred(message));
        }
    ).finally(
        () => dispatch(actionEndProcessing())
    )
};

export const thunkUpdateMemo = data => dispatch => {
    dispatch(actionStartProcessing());

    api.put(`mymemos/${data.id}/`, data).then(
        response => dispatch(actionMemoUpdated(response.data)),
        error => {
            const message = error.response?.data?.error || error.message;
            dispatch(actionErrorOcurred(message));
        }
    ).finally(
        () => dispatch(actionEndProcessing())
    )
};

export const selectStaredMemos = null;
export default slice.reducer;