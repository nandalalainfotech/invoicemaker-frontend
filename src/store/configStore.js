import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "./clientSlice";
import productRedicer from "./productSlice";
import companyReducer from "./companySlice";
import invoiceReducer from "./invoiceSlice";
import userReducer from "./userSlice";
import otpReducer from "./otpSlice";
import invoicedetailsReducer from "./invoiceSlice";
import invoicedeleteReducer from "./invoiceSlice";

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
    company: companyReducer,
    products: productRedicer,
    invoices: invoiceReducer,
    user: userReducer,
    otp: otpReducer,
    invoicedetails: invoicedetailsReducer,
    deleteInvoice: invoicedeleteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
