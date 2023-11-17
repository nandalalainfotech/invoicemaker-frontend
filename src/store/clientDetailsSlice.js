import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

export const getClientDetails = createAsyncThunk(
    'clients/ClientData',
    async (clientdetail) => {
        const response = await Axios.get('api/clients/getClientUser', clientdetail);
        let datas = response.data;
        return datas
    }
);

export const clientDetailsSlice = createSlice({
    name: "clientDetails",
    initialState: {
        loading: false,
        clientdetail: null,
        error: null
    },
    extraReducers: (builder) => {
        builder.addCase(getClientDetails.pending, (state) => {
            state.loading = true;
            state.clientdetail = null;
            state.error = null;
        })
            .addCase(getClientDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.clientdetail = action.payload;
                state.error = null;
            })
            .addCase(getClientDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default clientDetailsSlice.reducer;