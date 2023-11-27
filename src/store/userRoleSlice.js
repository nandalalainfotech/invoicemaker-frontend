import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

export const userRoles = createAsyncThunk(
    'user/UserData',
    async (userdetail) => {
        const response = await Axios.get('/api/users/getUsers', userdetail);
        let datas = response.data;
        return datas
    }
);

export const userRoleSlice = createSlice({
    name: "userRoleslice",
    initialState: {
        loading: false,
        userdetail: null,
        error: null
    },
    extraReducers: (builder) => {
        builder.addCase(userRoles.pending, (state) => {
            state.loading = true;
            state.userdetail = null;
            state.error = null;
        })
            .addCase(userRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.userdetail = action.payload;
                state.error = null;
            })
            .addCase(userRoles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default userRoleSlice.reducer;