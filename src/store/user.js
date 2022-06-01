import {
    createSlice
} from '@reduxjs/toolkit';
import api from 'services/api-client';

const initialUser = localStorage.getItem('user') ?
    JSON.parse(localStorage.getItem('user')) :
    {username: null, token: null};

const slice = createSlice({
    name: 'sliceUser',
    initialState: {
        user: initialUser,
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
        actionLoginSucceeded: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        actionSignupSucceeded: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        actionLogoutSucceeded: (state, action) => {
            state.user = {username: null, token: null};
            localStorage.removeItem('user');
        },
    },
});

// Actions

const {
    actionStartProcessing,
    actionEndProcessing,
    actionErrorOcurred,
    actionLoginSucceeded,
    actionLogoutSucceeded,
    actionSignupSucceeded,
} = slice.actions;

export const thunkLogin = (credentials) => dispatch => {
    dispatch(actionStartProcessing());

    api.post('login/', credentials).then(
        response => {
            const user = {
                username: credentials.username,
                token: response.data.token
            };
            dispatch(actionLoginSucceeded(user));
        },
        error => {
            const message = error.response?.data?.error || error.message;
            dispatch(actionErrorOcurred(message));
        }
    ).finally(
        () => dispatch(actionEndProcessing())
    );
};

export const thunkLogout = () => async dispatch => {
    dispatch(actionLogoutSucceeded());
};

export const thunkSignup = (credentials) => dispatch => {
    dispatch(actionStartProcessing());

    api.post('signup/', credentials).then(
        response => {
            const user = {
                username: credentials.username,
                token: response.data.token
            };
            dispatch(actionSignupSucceeded(user));
        },
        error => {
            const message = error.response?.data?.error || error.message;
            dispatch(actionErrorOcurred(message));
        }
    ).finally(
        () => dispatch(actionEndProcessing())
    );
};

export default slice.reducer;