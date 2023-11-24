import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const updateInvoice = createAsyncThunk(
    'invoice/updateInvoice',
    async (item1) => {
        console.log("register-------->4343", item1);
        // console.log("id-------->4343", id);
        const request = await Axios.put(`/api/invoices/updateInvoice/${item1.editId}`, item1.clientDetail);
        console.log('request====>', request)
        const response = await request.data;
        return response
    }
);

export const invoiceUpdateSlice = createSlice({
    name: "invoiceUpdateSlice",
    initialState: {
        loading: false,
        item1: null,
        error: null
    },
    extraReducers: (builder) => {
        builder.addCase(updateInvoice.pending, (state) => {
            state.loading = true;
            state.item1 = null;
            state.error = null;
        })
            .addCase(updateInvoice.fulfilled, (state, action) => {
                console.log("action-------->22", action)
                state.loading = false;
                state.success = true;
                state.item1 = action.payload;
                state.error = null;
            })
            .addCase(updateInvoice.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });

    },
});

export default invoiceUpdateSlice.reducer;