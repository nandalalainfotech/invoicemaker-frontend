import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const loginUser = createAsyncThunk(
    'user/loginUser',
      async(userInfo) => {
        const request = await Axios.post('/api/users', userInfo);
        const response = await request.data;
        localStorage.setItem('user', JSON.stringify(response));
        return response
      }
);

export const RegisterUser = createAsyncThunk(
    'user/RegisterUser',
    async(register) => {
        console.log("register-------->", register);
        const request = await Axios.post('/api/users/register', register);
        const response = await request.data;
        return response
    }
);




export const userSlice = createSlice({
    name:"user",
    initialState:{
        loading: false,
        user:null,
        error: null
    },
    extraReducers:(builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.user = null;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            console.log(action.error.message)
            if(action.error.message === 'Request Failed with status code 401') {
                state.error = 'Access Denied! Invalid Credentials'
            }
            else {
                state.error = action.error.message;
            }
        })
    },
    
    
})

export default userSlice.reducer;