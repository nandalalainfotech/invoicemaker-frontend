import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const editInvoice = createAsyncThunk(
    'invoice/editInvoice',
    async (item1) => {
        // console.log("register-------->", item1);
        const request = await Axios.get(`/api/invoices/editInvoice/${item1}`);
        const response = await request.data;
        return response
    }
);

export const invoiceEditSlice = createSlice({
    name: "invoiceEditSlice",
    initialState: {
        loading: false,
        item1: null,
        error: null
    },
    extraReducers: (builder) => {
        builder.addCase(editInvoice.pending, (state) => {
            state.loading = true;
            state.item1 = null;
            state.error = null;
        })
            .addCase(editInvoice.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.item1 = action.payload;
                state.error = null;
            })
            .addCase(editInvoice.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });

    },
});

export default invoiceEditSlice.reducer;