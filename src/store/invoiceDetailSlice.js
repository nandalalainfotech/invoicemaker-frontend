import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

export const userInvoices = createAsyncThunk(
    'invoice/UserInvoices',
    async () => {
        const response = await Axios.get('/api/invoices/getUserInvoices',);
        let datas = response.data;
        return datas
    }
);


export const invoiceListSlice = createSlice({
    name: "invoicelist",
    initialState: {
        loading: false,
        userdetailList: null,
        error: null
    },
    extraReducers: (builder) => {
        builder.addCase(userInvoices.pending, (state) => {
            state.loading = true;
            state.userdetailList = null;
            state.error = null;
        })
            .addCase(userInvoices.fulfilled, (state, action) => {
                state.loading = false;
                state.userdetailList = action.payload;
                state.error = null;
            })
            .addCase(userInvoices.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });

    },
});


export default invoiceListSlice.reducer;