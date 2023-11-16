import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const checkemail = createAsyncThunk(
    'login/checkemail',
    async (email) => {
        console.log("register-------->", email);
        const request = await Axios.post('/api/users/checkemail', { email });

        console.log("request--->", request);
        const response = await request.data;
        console.log("response---->", response);
        localStorage.setItem('userEmail', JSON.stringify(response));
        return response
    }
);

export const updateForgetPassword = createAsyncThunk(
    'login/profile',
    async ({ password, login }) => {
        console.log("login--->", login);
        console.log("password222222--->", password);
        const request = await Axios.put('/api/users/profile', { login, password });
        console.log("request--->", request);
        const response = await request.data;
        console.log("response---->", response);
        localStorage.setItem('forgetPassword', JSON.stringify(response));
        return response
    }
);

export const otpSlice = createSlice({
    name: "login",
    initialState: {
        loading: false,
        login: null,
        error: null
    },
    extraReducers: (builder) => {
        // console.log("builder--->", builder);

        builder.addCase(checkemail.pending, (state) => {
            state.loading = true;
            state.login = null;
            state.error = null;
        })
            .addCase(checkemail.fulfilled, (state, action) => {
                state.loading = false;
                state.login = action.payload;
                state.error = null;
            })
            .addCase(checkemail.rejected, (state, action) => {
                state.loading = false;
                state.login = null;
                console.log(action.error.message)
                if (action.error.message === 'Request Failed with status code 401') {
                    state.error = 'Access Denied! Invalid Credentials'
                }
                else {
                    state.error = action.error.message;
                }
            })
    },
})

export default otpSlice.reducer;