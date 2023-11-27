import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const deleteInvoice = createAsyncThunk(
    'invoice/deleteinvoice',
    async (id) => {
        const request = await Axios.delete(`/api/invoices/deleteInvoice/${id}`);
        const response = await request.data;
        return response
    }
);

export const deleteSlice = createSlice({
    name: "deleteSlice",
    initialState: {
        loading: false,
        id: null,
        error: null
    },
    extraReducers: (builder) => {
        builder.addCase(deleteInvoice.pending, (state) => {
            state.loading = true;
            state.id = null;
            state.error = null;
        })
            .addCase(deleteInvoice.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.id = action.payload;
                state.error = null;
            })
            .addCase(deleteInvoice.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });

    },
});

export default deleteSlice.reducer;